import mongoose, { type Document, Schema } from "mongoose"

export interface EmailHistory {
  date: Date
  type: string
  recruiterName: string
  status: string
  stage: string
  reason?: string
}

export interface ICandidate extends Document {
  name: string
  email: string
  test_link: string
  stage: string
  status: string
  notes?: string
  skills: string[]
  failureReason?: string
  emailHistory: EmailHistory[]
  createdAt: Date
  updatedAt: Date
}

const candidateSchema = new Schema<ICandidate>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    test_link: {
      type: String,
      required: [true, "Test link is required"],
      trim: true,
      match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, "Please enter a valid URL"],
    },
    stage: {
      type: String,
      default: "Stage 1",
      enum: ["Stage 1", "Stage 2", "Final"],
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Passed", "Failed"],
    },
    notes: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    failureReason: {
      type: String,
      trim: true,
    },
    emailHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        type: {
          type: String,
          enum: ["status_update"],
        },
        recruiterName: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          required: true,
        },
        stage: {
          type: String,
          required: true,
        },
        reason: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Create indexes for better query performance
candidateSchema.index({ name: "text", email: "text" })
candidateSchema.index({ stage: 1 })
candidateSchema.index({ status: 1 })
candidateSchema.index({ skills: 1 })

const Candidate = mongoose.model<ICandidate>("Candidate", candidateSchema)

export default Candidate
