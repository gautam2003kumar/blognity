import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import { serveApiResponse } from '@/utils/responseUtil'
import BlogModel from '@/model/Blog'
import UserModel from '@/model/User'
import dbConnect from '@/lib/dbConnect'
import { BlogRequestBody } from '@/types/blog'

export async function PATCH(req: NextRequest) {
  await dbConnect()

  try {
    const url = new URL(req.url)
    const blogId = url.pathname.split('/')[2]

    if (!blogId) {
      return serveApiResponse(false, 'Blog ID is missing from the request.', 400)
    }

    // Authenticate user
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return serveApiResponse(false, 'Unauthorized. Please sign in to edit blogs.', 401)
    }

    // Fetch user
    const user = (await UserModel.findOne({ email: session.user.email }).select('_id')) as {
      _id: string
    } | null
    if (!user) {
      return serveApiResponse(false, 'User not found.', 404)
    }

    // Find blog
    const blog = await BlogModel.findById(blogId).select('author')
    if (!blog) {
      return serveApiResponse(false, 'Blog not found.', 404)
    }

    // Authorization check
    if (blog.author.toString() !== user._id.toString()) {
      return serveApiResponse(false, 'You are not authorized to edit this blog.', 403)
    }

    // Parse and validate input
    const body: BlogRequestBody = await req.json()
    const { title, content, bannerUrl, description, status, category } = body

    if (!title || !content || !description) {
      return serveApiResponse(false, 'Title, content, and description are required.', 400)
    }

    // Update blog
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      {
        title,
        content,
        bannerUrl,
        description,
        status,
        categories: category || [],
        updatedAt: new Date(),
      },
      { new: true }
    )

    return serveApiResponse(true, 'Blog updated successfully.', 200, updatedBlog)
  } catch (error: any) {
    console.error('Error updating blog:', error)
    return serveApiResponse(false, 'Something went wrong while updating the blog.', 500)
  }
}
