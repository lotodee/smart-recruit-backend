const mongoose = require("mongoose")
const Schema = mongoose.Schema

const candidateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  test_link: {
    type: String,
    required: true,
  },
  stage: {
    type: String,
    default: "Stage 1",
  },
  status: {
    type: String,
    default: "Pending",
  },
  notes: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Candidate", candidateSchema)
