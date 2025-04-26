import BlogModel from '@/model/Blog'
import { serveApiResponse } from '@/utils/responseUtil'
import { NextRequest } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userid = session?.user._id

    // Validate User ID
    if (!userid || typeof userid !== 'string') {
      return serveApiResponse(false, 'Invalid or missing user ID in the request URL.', 400)
    }

    // Fetch blogs by user ID
    const blogs = await BlogModel.find({ author: userid }).select(
      'title status category comments views likes'
    )
    // If no blogs found
    if (!blogs || blogs.length === 0) {
      return serveApiResponse(true, 'No blogs found for the specified user.', 200, [])
    }

    const formatted = blogs.map(blog => ({
      _id: blog._id,
      title: blog.title,
      status: blog.status,
      category: blog.category,
      views: blog.views,
      likes: blog.likes,
    }))

    // Success response
    return serveApiResponse(true, 'Blogs retrieved successfully.', 200, formatted)
  } catch (error: any) {
    console.error('Error while fetching blogs:', error.message || error)

    return serveApiResponse(
      false,
      'An unexpected error occurred while retrieving blogs. Please try again later.',
      500
    )
  }
}
