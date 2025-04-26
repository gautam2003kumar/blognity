import { NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import BlogModel from '@/model/Blog'
import { getServerSession } from 'next-auth'
import { serveApiResponse } from '@/utils/responseUtil'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

// Define interface for request body
import { BlogRequestBody } from '@/types/blog'

export async function POST(req: NextRequest) {
  await dbConnect()

  try {
    // Validate and parse request data
    const body: BlogRequestBody = await req.json()
    const { title, content, bannerUrl, description, status, tags, category } = body

    if (!title || !content || !description) {
      return serveApiResponse(false, 'Title, Content, and Description are required.', 400)
    }

    // Get the logged-in user using NextAuth
    const session = await getServerSession(authOptions)

    if (!session?.user?._id) {
      return serveApiResponse(false, 'Unauthorized user, please login again', 401)
    }

    // Validate status if provided
    const validStatuses = ['draft', 'published']
    if (status && !validStatuses.includes(status)) {
      return serveApiResponse(
        false,
        'Invalid status provided. Valid statuses are: draft, published',
        400
      )
    }

    const newBlog = new BlogModel({
      title,
      content,
      bannerUrl,
      description,
      author: session.user._id,
      status: status || 'draft',
      tags: tags || [],
      category: category || '',
    })

    const response = await newBlog.save()

    if (!response) {
      return serveApiResponse(false, 'Failed to create blog', 500)
    }

    // Return success response
    return serveApiResponse(true, 'Blog created successfully', 201, response._id)
  } catch (error) {
    console.error('Error creating blog:', (error as Error).stack)
    return serveApiResponse(false, 'Internal server error while creating the blog', 500)
  }
}
