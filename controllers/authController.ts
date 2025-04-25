import type { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import User from "../models/userModel"

/**
 * Generate JWT token
 */
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret_do_not_use_in_production", {
    expiresIn: "30d",
  })
}

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body

  // Find user by username
  const user = await User.findOne({ username })

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      token: generateToken(user.username),
    })
  } else {
    res.status(401)
    throw new Error("Invalid username or password")
  }
})

/**
 * @desc    Initialize database with default admin user
 * @route   GET /api/auth/init
 * @access  Public
 */
export const initializeAdmin = asyncHandler(async (req: Request, res: Response) => {
  // Check if admin user exists
  const adminExists = await User.findOne({ username: "admin" })

  if (!adminExists) {
    // Create default admin user
    await User.create({
      username: "admin",
      password: "admin123", // Will be hashed by pre-save hook
      isAdmin: true,
    })

   res.status(201).json({
      success: true,
      message: "Admin user created successfully",
    })
  }

  res.status(200).json({
    success: true,
    message: "Admin user already exists",
  })
})

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id).select("-password")

  if (user) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})
