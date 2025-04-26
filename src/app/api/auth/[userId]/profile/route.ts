import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { serveApiResponse } from '@/utils/responseUtil'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const url = new URL(req.url)
    const userId = url.pathname.split('/')[2]

    if (!userId) {
      return serveApiResponse(false, 'User ID is required.', 400)
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      return serveApiResponse(false, 'This user is not in avalbale')
    }

    return serveApiResponse(true, 'Profile updated successfully.', 200, user)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return serveApiResponse(false, 'An unexpected error occurred while updating the profile.', 500)
  }
}
