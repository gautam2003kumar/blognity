import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { serveApiResponse } from '@/utils/responseUtil'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    await dbConnect()

    const { username, currentPassword, newPassword, confirmPassword } = await request.json()

    if (!username || !currentPassword || !newPassword || !confirmPassword) {
      return serveApiResponse(false, 'Please provide all required fields', 400)
    }

    if (newPassword !== confirmPassword) {
      return serveApiResponse(false, 'New password and confirmation do not match', 400)
    }

    const user = await UserModel.findById(username)
    if (!user) {
      return serveApiResponse(false, 'No user found with the provided ID', 404)
    }

    if (!user.password) {
      return serveApiResponse(false, 'User password is not set', 400)
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return serveApiResponse(false, 'Incorrect current password', 400)
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    return serveApiResponse(true, 'Your password has been updated successfully', 200)
  } catch (error) {
    console.error('An error occurred while resetting the password: ', error)
    return serveApiResponse(false, 'Something went wrong. Please try again later', 500)
  }
}
