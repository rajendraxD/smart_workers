import { User } from '../models/User.js';
import UserRepository from '../repositories/UserRepository.js';
import RoleRepository from '../repositories/RoleRepository.js';
import RefreshTokenRepository from '../repositories/RefreshTokenRepository.js';
import { signAccessToken, generateRefreshToken, generateOtp, hashToken, hashOtp, verifyAccessToken } from '../utils/token.js';
import { ApiError } from '../utils/ApiError.js';
import { USER_STATUS } from '../utils/constants.js';
import { env } from '../config/env.js';

class AuthService {
  /** Register a new user */
  async register({ firstName, lastName, email, password }) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) throw ApiError.conflict('Email already registered');

    const defaultRole = await RoleRepository.findByName('User');
    if (!defaultRole) throw ApiError.notFound('Default role not configured');

    const user = await UserRepository.create({
      firstName,
      lastName,
      email,
      password,
      roleId: defaultRole._id,
      status: USER_STATUS.ACTIVE
    });

    return UserRepository.findById(user._id);
  }

  /** Authenticate a user and issue tokens */
  async login(email, password, context = {}) {
    const user = await UserRepository.findByEmailWithPassword(email);
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    if (user.isDeleted) throw ApiError.unauthorized('Invalid email or password');
    if (user.status !== USER_STATUS.ACTIVE) throw ApiError.forbidden('Account is not active');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

    const tokens = await this.issueTokens(user._id, context);
    await UserRepository.updateLastLogin(user._id);

    const populatedUser = await UserRepository.findById(user._id);

    return { user: populatedUser, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  /** Refresh access token using refresh token */
  async refresh(refreshTokenValue, context = {}) {
    if (!refreshTokenValue) throw ApiError.unauthorized('Refresh token required');

    const tokenHash = hashToken(refreshTokenValue);
    const storedToken = await RefreshTokenRepository.findByHash(tokenHash);

    if (!storedToken) throw ApiError.unauthorized('Invalid refresh token');
    if (storedToken.revokedAt) throw ApiError.unauthorized('Refresh token revoked');
    if (storedToken.expiresAt < new Date()) throw ApiError.unauthorized('Refresh token expired');

    const user = await UserRepository.findById(storedToken.userId);
    if (!user || user.isDeleted || user.status !== USER_STATUS.ACTIVE) {
      throw ApiError.unauthorized('User account is not available');
    }

    const newTokens = await this.issueTokens(user._id, context);
    await RefreshTokenRepository.revokeWithReplacement(storedToken._id, hashToken(newTokens.refreshToken));

    return { user, accessToken: newTokens.accessToken, refreshToken: newTokens.refreshToken };
  }

  /** Logout: revoke the current refresh token */
  async logout(refreshTokenValue) {
    if (!refreshTokenValue) return;
    const tokenHash = hashToken(refreshTokenValue);
    const storedToken = await RefreshTokenRepository.findByHash(tokenHash);
    if (storedToken) {
      await RefreshTokenRepository.revoke(storedToken._id);
    }
  }

  /** Logout from all devices */
  async logoutAll(userId) {
    await RefreshTokenRepository.revokeAllForUser(userId);
  }

  /** Forgot password: generate and store OTP */
  async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) return { otp: null, email: null };

    const { code, hash, expires } = generateOtp();
    await UserRepository.updateById(user._id, {
      resetOtpHash: hash,
      resetOtpExpires: expires
    });

    return { otp: code, email: user.email };
  }

  /** Reset password using OTP */
  async resetPassword(email, otp, newPassword) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw ApiError.badRequest('Invalid or expired OTP');

    // Need to query with OTP fields selected (they have select: false in schema)
    const userWithOtp = await User.findById(user._id).select('+resetOtpHash +resetOtpExpires');

    if (!userWithOtp.resetOtpHash || !userWithOtp.resetOtpExpires) {
      throw ApiError.badRequest('Invalid or expired OTP');
    }

    if (userWithOtp.resetOtpExpires < new Date()) {
      throw ApiError.badRequest('OTP has expired');
    }

    const otpHash = hashOtp(otp);
    if (otpHash !== userWithOtp.resetOtpHash) {
      throw ApiError.badRequest('Invalid OTP');
    }

    userWithOtp.password = newPassword;
    userWithOtp.resetOtpHash = null;
    userWithOtp.resetOtpExpires = null;
    await userWithOtp.save();

    await RefreshTokenRepository.revokeAllForUser(user._id);
  }

  /** Change password */
  async changePassword(userId, currentPassword, newPassword, excludeRefreshTokenHash) {
    const user = await User.findById(userId).select('+password');
    if (!user) throw ApiError.notFound('User not found');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw ApiError.badRequest('Current password is incorrect');

    user.password = newPassword;
    await user.save();

    await RefreshTokenRepository.revokeAllForUserExcept(userId, excludeRefreshTokenHash);
  }

  /** Get current user profile */
  async getCurrentUser(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  /** Issue access and refresh tokens (public for controller use) */
  async issueTokens(userId, context) {
    const accessToken = signAccessToken({ sub: userId.toString() });

    const { raw: refreshToken, hash, expiresAt } = generateRefreshToken();

    await RefreshTokenRepository.create({
      userId,
      tokenHash: hash,
      expiresAt,
      device: {
        userAgent: context.userAgent || '',
        browser: context.browser || '',
        os: context.os || '',
        ip: context.ip || ''
      }
    });

    return { accessToken, refreshToken };
  }
}

export default new AuthService();
