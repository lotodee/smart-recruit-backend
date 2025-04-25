import type { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import Candidate, { type ICandidate } from "../models/candidateModel"
import { sendEmail } from "../utils/emailService"
import { UpdateQuery } from "mongoose";
/**
 * @desc    Get all candidates
 * @route   GET /api/candidates
 * @access  Private
 */
export const getCandidates = asyncHandler(async (req: Request, res: Response) => {
  console.log("hit the endpoint")
  const candidates = await Candidate.find({}).sort({ createdAt: -1 })

  res.json({
    success: true,
    count: candidates.length,
    data: candidates,
  })
})

/**
 * @desc    Get single candidate
 * @route   GET /api/candidates/:id
 * @access  Private
 */
export const getCandidateById = asyncHandler(async (req: Request, res: Response) => {
  const candidate = await Candidate.findById(req.params.id)

  if (candidate) {
    res.json({
      success: true,
      data: candidate,
    })
  } else {
    res.status(404)
    throw new Error("Candidate not found")
  }
})

/**
 * @desc    Create a candidate
 * @route   POST /api/candidates
 * @access  Private
 */
export const createCandidate = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, test_link, stage, status, notes, skills } = req.body

  
//   const existingUser = await Candidate.findOne({
//     email: { $regex: new RegExp(`^${email}$`, "i") },
//   }); 

//   if (existingUser) {
//  res.status(403).json({
//       success: false,
//       message: "Candidate exists — email is not unique",
//     });
//   }
  const candidate = await Candidate.create({
    name,
    email,
    test_link,
    stage: stage || "Stage 1",
    status: status || "Pending",
    notes,
    skills: skills || [],
  })

  res.status(201).json({
    success: true,
    data: candidate,
  })
})

/**
 * @desc    Update a candidate
 * @route   PUT /api/candidates/:id
 * @access  Private
 */
export const updateCandidate = asyncHandler(async (req: Request, res: Response) => {
  const candidate = await Candidate.findById(req.params.id)

  if (!candidate) {
    res.status(404)
    throw new Error("Candidate not found")
  }

  const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.json({
    success: true,
    data: updatedCandidate,
  })
})

/**
 * @desc    Delete a candidate
 * @route   DELETE /api/candidates/:id
 * @access  Private
 */
export const deleteCandidate = asyncHandler(async (req: Request, res: Response) => {
  const candidate = await Candidate.findById(req.params.id)

  if (!candidate) {
    res.status(404)
    throw new Error("Candidate not found")
  }

  await candidate.deleteOne()

  res.json({
    success: true,
    message: "Candidate removed",
  })
})

/**
 * @desc    Search candidates
 * @route   GET /api/candidates/search/:query
 * @access  Private
 */
export const searchCandidates = asyncHandler(async (req: Request, res: Response) => {
  const query = req.params.query

  const candidates = await Candidate.find({
    $or: [{ name: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
  }).sort({ createdAt: -1 })

  res.json({
    success: true,
    count: candidates.length,
    data: candidates,
  })
})

/**
 * @desc    Send status update email
 * @route   POST /api/candidates/:id/send-email
 * @access  Private
 */
export const sendStatusEmail = asyncHandler(async (req: Request, res: Response) => {
  
  console.log(req.body)
  const { recruiterName,recruiterEmail, reason } = req.body;

  
  const candidate = await Candidate.findById(req.params.id)

  if (!candidate) {
    res.status(404)
    throw new Error("Candidate not found")
  }

  // Send the email
  const emailResult = await sendEmail({
    to: candidate.email,
    candidateName: candidate.name,
    recruiterName,
    recruiterEmail,
    stage: candidate.stage,
    status: candidate.status,
    reason,
  });

  if (!emailResult.success) {
    res.status(500)
    throw new Error("Failed to send email")
  }

  // Update candidate with email history and failure reason if applicable
  const emailHistoryEntry = {
    date: new Date(),
    type: "status_update",
    recruiterName,
    recruiterEmail,
    status: candidate.status,
    stage: candidate.stage,
    reason,
  }

  const update: UpdateQuery<ICandidate> = {
    $push: { emailHistory: emailHistoryEntry },
  } as any

  if (candidate.status === "Failed" && reason) {
    update.failureReason = reason
  }

  const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, update, { new: true })

  res.json({
    success: true,
    data: updatedCandidate,
    emailPreview: emailResult.messageUrl,
  })
})
