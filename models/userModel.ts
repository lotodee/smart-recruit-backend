import mongoose, { type Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  username: string
  password: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
  matchPassword(enteredPassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

/**
 * Compare entered password with stored hashed password
 */
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password)
}

/**
 * Hash password before saving
 */
userSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) {
    return next()
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.model<IUser>("User", userSchema)

export default User
