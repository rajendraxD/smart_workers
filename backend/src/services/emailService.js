import nodemailer from 'nodemailer';
import  env  from '../config/env.js';
import { logger } from '../config/logger.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!env.smtp.host) return null; // dev mode: log instead of send
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const tx = getTransporter();
  if (!tx) {
    logger.info(`[email:dev] To: ${to} | Subject: ${subject}\n${text || html}`);
    return { delivered: false, dev: true };
  }
  await tx.sendMail({ from: env.smtp.from, to, subject, html, text });
  return { delivered: true };
}

export const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to Smart workers platform',
    text: `Hi ${name}, your account has been created successfully.`,
    html: `<p>Hi <b>${name}</b>,</p><p>Your account has been created successfully.</p>`,
  }),
  otp: (name, code, minutes) => ({
    subject: 'Your Password Reset Code',
    text: `Hi ${name}, your password reset code is ${code}. It expires in ${minutes} minutes.`,
    html: `<p>Hi <b>${name}</b>,</p><p>Your password reset code is <b style="font-size:18px">${code}</b>.</p><p>It expires in ${minutes} minutes.</p>`,
  }),
};
