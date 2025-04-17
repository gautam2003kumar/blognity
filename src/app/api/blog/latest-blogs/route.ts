import dbConnect from '@/lib/dbConnect'
import Blog from '@/model/Blog'
import { serveApiResponse } from '@/utils/responseUtil'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest) {
  await dbConnect()

  try {
    const Blogs = await Blog.find({
      status: 'published',
    })
      .sort({ createdAt: -1 })
      .limit(10)
    if (!Blogs) {
      return serveApiResponse(false, 'No blogs found', 404)
    }
    return serveApiResponse(true, 'Blogs fetched successfully', 200, Blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return serveApiResponse(false, 'Unable to get the blog', 500)
  }
}
