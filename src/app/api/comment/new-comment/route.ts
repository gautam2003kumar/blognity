import dbConnect from '@/lib/dbConnect'
import { serveApiResponse } from '@/utils/responseUtil'
import CommentModel from '@/model/Comment'
import { getSession } from 'next-auth/react'

interface CommentRequestBody {
  content: string
  blogId: string
  userId: string
  name: string
  status?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  isDeleted?: boolean
  isEdited?: boolean
  isPinned?: boolean
  likes?: number
}

export async function POST(req: Request) {
  await dbConnect()

  try {
    const body: CommentRequestBody = await req.json()
    const { content, blogId, name, userId } = body

    // Basic validation
    if (!content || !blogId) {
      return serveApiResponse(false, 'Comment content and blog ID are required.', 400)
    }

    // Get session
    const session = await getSession({ req: { headers: Object.fromEntries(req.headers) } })

    if (!session?.user?._id) {
      return serveApiResponse(false, 'Unauthorized. Please log in to comment.', 401)
    }

    // Create comment
    const newComment = await CommentModel.create({
      userId,
      name,
      blogId,
      content,
    })

    if (!newComment) {
      return serveApiResponse(false, 'Something went wrong. Could not save your comment.', 500)
    }

    return serveApiResponse(true, 'Comment posted successfully!', 201, newComment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return serveApiResponse(false, 'Server error. Failed to post comment.', 500)
  }
}
