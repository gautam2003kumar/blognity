import dbConnect from '@/lib/dbConnect'
import { serveApiResponse } from '@/utils/responseUtil'
import CommentModel from '@/model/Comment'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'

interface CommentRequestBody {
  content: string
  blogId: string
  name?: string
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
    const session = await getServerSession(authOptions)

    if (!session?.user?._id) {
      return serveApiResponse(false, 'Unauthorized. Please log in to comment.', 401)
    }

    const body: CommentRequestBody = await req.json()
    const { content, blogId, name } = body

    if (!content || !blogId) {
      return serveApiResponse(false, 'Comment content and blog ID are required.', 400)
    }

    const newComment = await CommentModel.create({
      userId: session.user._id,
      name,
      blogId,
      content,
    })

    return serveApiResponse(true, 'Comment posted successfully!', 201, newComment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return serveApiResponse(false, 'Server error. Failed to post comment.', 500)
  }
}
