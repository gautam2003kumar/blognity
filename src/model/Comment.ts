import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  blogId: mongoose.Schema.Types.ObjectId;
  name: string;
  content: string;
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  likeCount?: number;
}

const CommentSchema: Schema<IComment> = new Schema<IComment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: "Anonymous", // Optional: fallback name
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CommentSchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});

CommentSchema.index({ createdAt: -1 });

const CommentModel: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default CommentModel;