import Joi from "joi";

// At least 8 chars, one uppercase, one lowercase, one digit, one special char.
const passwordRule = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
  .message(
    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
  );

const email = Joi.string()
  .email({
    minDomainSegments: 2, // at least 2 segments (e.g. gmail.com, outlook.com)
    tlds: { allow: ["com"] },
  })
  // .pattern(/@gmail\.com$/)
  .message("Enter a valid email address")
  .lowercase()
  .required();
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email,
  password: passwordRule,
});
export const loginSchema = Joi.object({
  email,
  password: Joi.string().required(),
  rememberMe: Joi.boolean().default(false),
});
