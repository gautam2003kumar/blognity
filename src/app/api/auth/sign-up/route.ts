import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/helper/sendVerificationEmail'
import { serveApiResponse } from '@/utils/responseUtil'

export async function POST(request: Request) {
  try {
    await dbConnect()

    const { username, email, password } = await request.json()

    // Check for username availability
    const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true })
    if (existingUserVerifiedByUsername) {
      return serveApiResponse(false, 'Username is already taken', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiryDate = new Date(Date.now() + 3600000)

    // Check for existing user by email
    const existingUserByEmail = await UserModel.findOne({ email })

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return serveApiResponse(false, 'User already exists with this email', 400)
      } else {
        // Update user if not verified
        existingUserByEmail.password = hashedPassword
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyCodeExpiry = expiryDate
        await existingUserByEmail.save()
      }
    } else {
      // Create a new user if no existing record
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        isVerified: false,
        verifyCodeExpiry: expiryDate,
        isAdmin: false,
      })

      await newUser.save()
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode)

    if (!emailResponse.success) {
      return serveApiResponse(false, emailResponse.message, 500)
    }

    return serveApiResponse(true, 'User registered successfully. Please verify your email.', 201)
  } catch (error) {
    console.error('Error while registering the user:', error)
    return serveApiResponse(false, 'Error while registering the user', 500)
  }
}
