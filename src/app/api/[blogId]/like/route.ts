import dbConnect from '@/lib/dbConnect'
import BlogModel from '@/model/Blog'
import { serveApiResponse } from '@/utils/responseUtil'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect()

    const url = new URL(req.url)
    const blogId = url.pathname.split('/')[2]

    // Check if blogId exists
    if (!blogId) {
      return serveApiResponse(false, 'Blog ID is missing', 400)
    }

    // Find the blog by blogId
    const blog = await BlogModel.findById(blogId).select('likes')

    // If blog is not found
    if (!blog) {
      return serveApiResponse(false, 'Blog not found', 404)
    }

    // Increment the likes count
    blog.likes = (blog.likes || 0) + 1

    // Save the updated blog
    await blog.save()

    // Return success response with updated like count
    return serveApiResponse(true, 'Blog liked successfully', 200, { likes: blog.likes })
  } catch (error) {
    console.error('Error liking the blog:', error)
    return serveApiResponse(false, 'Internal Server Error', 500)
  }
}
