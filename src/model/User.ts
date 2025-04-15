import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  password?: string // optional for Google auth
  verifyCode?: string
  verifyCodeExpiry?: Date
  isVerified: boolean
  isAdmin: boolean
  provider: 'local' | 'google'
  googleId?: string // for tracking Google users
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'],
    },

    password: {
      type: String,
      required: function () {
        return this.provider === 'local'
      },
    },

    verifyCode: {
      type: String,
      required: function () {
        return this.provider === 'local'
      },
    },

    verifyCodeExpiry: {
      type: Date,
      required: function () {
        return this.provider === 'local'
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // to avoid index conflict for non-Google users
    },
  },
  { timestamps: true }
)

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default UserModel
