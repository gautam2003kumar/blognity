import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import { serveApiResponse } from '@/utils/responseUtil'
import BlogModel from '@/model/Blog'
import UserModel from '@/model/User'
import dbConnect from '@/lib/dbConnect'

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect()

    const url = new URL(req.url)
    const blogId = url.pathname.split('/')[2]

    if (!blogId) {
      return serveApiResponse(false, 'Blog ID is missing from the request.', 400)
    }

    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return serveApiResponse(false, 'Unauthorized. Please sign in to delete blogs.', 401)
    }

    const user = (await UserModel.findOne({ email: session.user.email }).select('_id')) as {
      _id: string
    } | null
    if (!user) {
      return serveApiResponse(false, 'User not found in the system.', 404)
    }

    const blog = await BlogModel.findById(blogId).select('author')
    if (!blog) {
      return serveApiResponse(false, 'Blog not found or already deleted.', 404)
    }

    if (blog.author.toString() !== user._id.toString()) {
      return serveApiResponse(false, 'You are not authorized to delete this blog.', 403)
    }

    await BlogModel.findByIdAndDelete(blogId)

    return serveApiResponse(true, 'Blog deleted successfully.', 200)
  } catch (error: any) {
    console.error('Error deleting blog:', error.message || error)
    return serveApiResponse(false, 'Something went wrong while deleting the blog.', 500)
  }
}
