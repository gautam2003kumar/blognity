import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { serveApiResponse } from '@/utils/responseUtil'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { authOptions } from '../../[...nextauth]/options'

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect()
    const url = new URL(req.url)
    const userId = url.pathname.split('/')[2]

    const { fullName, bio, socialUrl } = await req.json()
    const session = await getServerSession(authOptions)

    if (!session?.user?._id) {
      return serveApiResponse(false, 'Unauthorized user, please login again', 401)
    }

    if (!userId) {
      return serveApiResponse(false, 'User ID is required.', 400)
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { fullName, bio, socialUrl },
      { new: true }
    )

    if (!updatedUser) {
      return serveApiResponse(false, 'User not found or update failed.', 404)
    }

    return serveApiResponse(true, 'Profile updated successfully.', 200, updatedUser)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return serveApiResponse(false, 'An unexpected error occurred while updating the profile.', 500)
  }
}
