import Joi from "joi"

/**
 * Validation schema for login
 */
export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required",
    "any.required": "Username is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
})
