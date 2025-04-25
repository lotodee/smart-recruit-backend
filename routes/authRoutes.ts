import express from "express"
import { loginUser, initializeAdmin, getUserProfile } from "../controllers/authController"
import { protect } from "../middleware/authMiddleware"
import { validateRequest } from "../middleware/validationMiddleware"
import { loginSchema } from "../validation/authValidation"

const router = express.Router()

// Public routes
router.post("/login", validateRequest(loginSchema), loginUser)
router.get("/init", initializeAdmin)

// Protected routes
router.get("/profile", protect, getUserProfile)

export default router
