import UserModel from '@/model/User'
import { generateVerificationCode, verifyCodeExpiry } from '@/lib/utils'
import { sendVerificationEmail } from '@/helper/sendVerificationEmail'
import { serveApiResponse } from '@/utils/responseUtil'

export async function POST(req: Request) {
  try {
    const { username } = await req.json()

    if (!username) {
      return serveApiResponse(false, 'Username is required', 400)
    }

    // Find user by username
    const user = await UserModel.findOne({ username })

    if (!user) {
      return serveApiResponse(false, 'User not found', 404)
    }

    const code = generateVerificationCode()

    // Update verification code and expiry
    user.verifyCode = code
    user.verifyCodeExpiry = verifyCodeExpiry()
    await user.save()

    // Send the email
    const response = await sendVerificationEmail(user.email, user.username, code)

    if (!response.success) {
      return serveApiResponse(false, response.message || 'Failed to resend verification email', 500)
    }

    return serveApiResponse(true, 'Verification code resent successfully', 200)
  } catch (err) {
    console.error('Resend Code API Error:', err)
    return serveApiResponse(false, "Internal server error, while resending the verification code ", 500, err)
  }
}
