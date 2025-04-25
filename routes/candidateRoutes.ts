import express from "express"
import {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  searchCandidates,
  sendStatusEmail,
} from "../controllers/candidateController"
import { protect } from "../middleware/authMiddleware"
import { validateRequest } from "../middleware/validationMiddleware"
import { createCandidateSchema, updateCandidateSchema, sendEmailSchema } from "../validation/candidateValidation"

const router = express.Router()

// All routes are protected
router.use(protect)

// Get all candidates
router.get("/", getCandidates)

// Search candidates
router.get("/search/:query", searchCandidates)

// Send status update email
router.post("/:id/send-email", validateRequest(sendEmailSchema), sendStatusEmail)

// Get, update, delete candidate by ID
router
  .route("/:id")
  .get(getCandidateById)
  .put(validateRequest(updateCandidateSchema), updateCandidate)
  .delete(deleteCandidate)

// Create new candidate
router.post("/", validateRequest(createCandidateSchema), createCandidate)

export default router
