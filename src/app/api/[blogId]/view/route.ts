import dbConnect from '@/lib/dbConnect'
import BlogModel from '@/model/Blog'
import { serveApiResponse } from '@/utils/responseUtil'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect()

    const url = new URL(req.url)
    const blogId = url.pathname.split('/')[2]

    if (!blogId) {
      return serveApiResponse(false, 'Blog ID is missing', 400)
    }

    const blog = await BlogModel.findById(blogId).select('views')

    if (!blog) {
      return serveApiResponse(false, 'Blog not found', 404)
    }

    blog.views = (blog.views || 0) + 1
    await blog.save()

    return serveApiResponse(true, 'Blog view count updated successfully', 200, {
      views: blog.views,
    })
  } catch (error) {
    console.error('Error viewing blog:', error)
    return serveApiResponse(false, 'Internal Server Error', 500)
  }
}
