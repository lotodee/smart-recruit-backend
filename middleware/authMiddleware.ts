import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/userModel"

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

/**
 * Protect routes - Verify JWT token and set req.user
 */
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_do_not_use_in_production")

      // Get user from the token (exclude password)
      req.user = await User.findById((decoded as any).username).select("-password")

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error("Not authorized, token failed")
    }
  }

  if (!token) {
    res.status(401)
    throw new Error("Not authorized, no token")
  }
})

/**
 * Admin middleware - Check if user is admin
 */
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403)
    throw new Error("Not authorized as an admin")
  }
}
