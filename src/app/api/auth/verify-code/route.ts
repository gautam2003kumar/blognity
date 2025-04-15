import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { serveApiResponse } from '@/utils/responseUtil'

export async function POST(request: Request) {
  await dbConnect()

  try {
    const { code, username } = await request.json()
    const decodedUsername = decodeURIComponent(username)

    console.log(code, decodedUsername)
    const user = await UserModel.findOne({ username: decodedUsername })

    if (!user) {
      return serveApiResponse(false, 'User not found. Please check the username.', 404)
    }

    if (user.isVerified) {
      return serveApiResponse(false, 'This account is already verified.', 400)
    }

    const isCodeValid = user.verifyCode === code
    if (!isCodeValid) {
      return serveApiResponse(
        false,
        'Verification code is incorrect. Please sign up again to receive a new code.',
        400
      )
    }

    const isCodeNotExpired = user.verifyCodeExpiry
      ? new Date(user.verifyCodeExpiry) > new Date()
      : false
    if (!isCodeNotExpired) {
      return serveApiResponse(
        false,
        'Verification code has expired. Please sign up again to receive a new code.',
        400
      )
    }

    user.isVerified = true
    await user.save()
    return serveApiResponse(true, 'Account verified successfully.', 200)
  } catch (error) {
    console.error('Error while verifying user:', error)
    return serveApiResponse(
      false,
      'An unexpected error occurred during verification. Please try again.',
      500
    )
  }
}
