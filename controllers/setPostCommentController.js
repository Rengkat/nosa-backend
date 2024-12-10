const CustomError = require("../errors");
const Comment = require("../model/setPostCommentModel");
const SetPost = require("../model/setPostModel");
const { StatusCodes } = require("http-status-codes");

// Add a comment to a post or as a reply
const addPostComment = async (req, res, next) => {
  try {
    const { postId, content, parentCommentId } = req.body;

    if (!content) {
      throw new CustomError.BadRequestError("Comment content is required");
    }

    if (!postId && !parentCommentId) {
      throw new CustomError.BadRequestError("Either post ID or parent comment ID is required");
    }

    // Verify post existence if it's a top-level comment
    if (postId) {
      const post = await SetPost.findById(postId);
      if (!post) {
        throw new CustomError.NotFoundError("Post not found");
      }
    }

    // Verify parent comment existence if it's a reply
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        throw new CustomError.NotFoundError("Parent comment not found");
      }
    }

    // Create the comment or reply
    const newComment = await Comment.create({
      post: postId || undefined,
      author: req.user.id,
      content,
    });

    // If it's a reply, update the parent comment's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: newComment._id },
      });
    }

    res.status(StatusCodes.CREATED).json({
      message: "Comment added successfully",
      success: true,
      comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

// Get all comments for a specific post
const getAllPostComments = async (req, res, next) => {
  try {
    const { postId } = req.query;

    if (!postId) {
      throw new CustomError.BadRequestError("Post ID is required");
    }

    const comments = await Comment.find({ post: postId, replies: { $size: 0 } }) // Fetch top-level comments only
      .populate("author", "firstName surname image")
      .populate({
        path: "replies",
        populate: { path: "author", select: "firstName surname image" },
      });

    res.status(StatusCodes.OK).json({
      success: true,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a comment or reply
const deletePostComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      throw new CustomError.BadRequestError("Comment ID is required");
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new CustomError.NotFoundError("Comment not found");
    }

    // Check if the user is authorized to delete
    if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
      throw new CustomError.UnauthorizedError("Not authorized to delete this comment");
    }

    // Delete the comment or reply
    if (comment.replies.length > 0) {
      throw new CustomError.BadRequestError(
        "Cannot delete a comment with replies. Delete the replies first."
      );
    }

    await Comment.findByIdAndDelete(commentId);

    // Optionally remove it from parent's replies array
    if (comment.parentCommentId) {
      await Comment.findByIdAndUpdate(comment.parentCommentId, {
        $pull: { replies: commentId },
      });
    }

    res.status(StatusCodes.OK).json({
      message: "Comment deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addPostComment, getAllPostComments, deletePostComment };
