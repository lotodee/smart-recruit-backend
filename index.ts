import express, { type Request, type Response, type NextFunction } from "express"
import cors from "cors"
import connectDB from "./db/connect"
import authRoutes from "./routes/authRoutes"
import candidateRoutes from "./routes/candidateRoutes"
import dotenv from "dotenv";
dotenv.config();
// Initialize express app
const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Connect to MongoDB
connectDB()

// Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/candidates", candidateRoutes)

// Default route
app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "SmartRecruit API is running" })
})

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: "Something went wrong!" })
})

// Port setup
const PORT = process.env.PORT || 5000

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

// Export for serverless
export default app
