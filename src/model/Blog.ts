import mongoose, { Schema, Document, Model } from 'mongoose'
import { EditorContent } from '@/types/Block'
// Interface for TypeScript
interface IBlog extends Document {
  title: string
  content: EditorContent
  bannerUrl?: string
  description: string
  author: mongoose.Types.ObjectId
  status: 'draft' | 'published'
  tags?: string[]
  category?: string[]
  comments?: mongoose.Types.ObjectId[]
  views?: number
  likes?: number
}

const BlogSchema: Schema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    bannerUrl: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    tags: [
      {
        type: String,
        index: true,
      },
    ],
    category: {
      type: [String],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const BlogModel: Model<IBlog> =
  (mongoose.models.Blog as Model<IBlog>) || mongoose.model<IBlog>('Blog', BlogSchema)
export default BlogModel
