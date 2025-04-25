import Joi from "joi"

/**
 * Validation schema for creating a candidate
 */
export const createCandidateSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),
  test_link: Joi.string().uri().required().messages({
    "string.empty": "Test link is required",
    "string.uri": "Please enter a valid URL",
    "any.required": "Test link is required",
  }),
  stage: Joi.string().valid("Stage 1", "Stage 2", "Final"),
  status: Joi.string().valid("Pending", "Passed", "Failed"),
  notes: Joi.string().allow("", null),
  skills: Joi.array().items(Joi.string()),
})

/**
 * Validation schema for updating a candidate
 */
export const updateCandidateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().messages({
    "string.email": "Please enter a valid email",
  }),
  test_link: Joi.string().uri().messages({
    "string.uri": "Please enter a valid URL",
  }),
  stage: Joi.string().valid("Stage 1", "Stage 2", "Final"),
  status: Joi.string().valid("Pending", "Passed", "Failed"),
  notes: Joi.string().allow("", null),
  skills: Joi.array().items(Joi.string()),
  failureReason: Joi.string().allow("", null),
}).min(1)

/**
 * Validation schema for sending email
 */
export const sendEmailSchema = Joi.object({
  recruiterName: Joi.string().required().messages({
    "string.empty": "Recruiter name is required",
    "any.required": "Recruiter name is required",
  }),
  reason: Joi.string().allow("", null),
})
