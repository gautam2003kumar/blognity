import dbConnect from '@/lib/dbConnect'
import CommentModel from '@/model/Comment'
import { serveApiResponse } from '@/utils/responseUtil'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const blogId = url.pathname.split('/')[4]

  if (!blogId) {
    return serveApiResponse(false, 'Blog ID is required in the URL', 400)
  }

  try {
    await dbConnect()

    // Sort by likes descending, then createdAt descending
    const comments = await CommentModel.find({ blogId }).sort({ likes: -1, createdAt: -1 })
    if (!comments.length) {
      return serveApiResponse(false, 'No comments available for this blog', 200)
    }

    return serveApiResponse(true, 'Comments retrieved successfully', 200, comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return serveApiResponse(false, 'An unexpected error occurred while retrieving comments', 500)
  }
}
