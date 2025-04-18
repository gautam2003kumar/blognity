import dbConnect from "@/lib/dbConnect";
import CommentModel from "@/model/Comment";
import { serveApiResponse } from "@/utils/responseUtil";

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const commentId = url.pathname.split("/")[4];

    if (!commentId) {
        return serveApiResponse(false, "Comment ID is required", 400);
    }

    console.log("Deleting comment with ID:", commentId);

    try {
        await dbConnect();        
        const deletedComment = await CommentModel.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return serveApiResponse(false, "Comment not found", 404);
        }

        return serveApiResponse(true, "Comment deleted successfully", 200);
    } catch (error) {
        console.error("Error deleting comment:", error);
        return serveApiResponse(false, "Unable to delete the comment", 500);
    }
}