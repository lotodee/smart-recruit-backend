import type { Request, Response, NextFunction } from "express"
import type { Schema } from "joi"

/**
 * Validate request body against a Joi schema
 */
export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      })
    }

    next()
  }
}
