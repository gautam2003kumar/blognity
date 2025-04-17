import dbConnect from '@/lib/dbConnect'
import BlogModel from '@/model/Blog'
import { serveApiResponse } from '@/utils/responseUtil'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const url = new URL(req.url)
    const blogid = url.pathname.split('/')[4]

    const blog = await BlogModel.findOne({ _id: blogid })

    if (!blog) {
      return serveApiResponse(false, 'Blog not found', 404)
    }

    return serveApiResponse(true, 'Blog fetched successfully', 200, blog)
  } catch (error) {
    console.error('[BLOG_PREVIEW_ERROR]', error)
    return serveApiResponse(false, 'Failed to fetch blog', 500)
  }
}
