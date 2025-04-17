import dbConnect from '@/lib/dbConnect'
import BlogModel from '@/model/Blog'
import { serveApiResponse } from '@/utils/responseUtil'

export async function GET(
  req: Request,
  { params }: { params: { blogid: string } }
) {
  try {

    await dbConnect()
    const { blogid } = await params
    console.log(blogid)

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
