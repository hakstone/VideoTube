import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { Like } from "../models/like.model.js" // Add this import
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!videoId) {
        throw new ApiError(400, "Video doesn't exist")
    }

    const skip = (page - 1) * limit

    // Use aggregation to get comments with owner details, likes count, and user's like status
    const commentsAggregate = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "likes",
                let: { commentId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$comment", "$$commentId"] },
                                    { $eq: ["$likedBy", new mongoose.Types.ObjectId(req.user?._id || null)] }
                                ]
                            }
                        }
                    }
                ],
                as: "userLike"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                likesCount: {
                    $size: "$likes"
                },
                isLiked: {
                    $gt: [{ $size: "$userLike" }, 0]
                }
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                video: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1
            }
        },
        {
            $sort: {
                createdAt: -1 // Sort by newest first
            }
        },
        {
            $skip: skip
        },
        {
            $limit: parseInt(limit)
        }
    ])

    const total = await Comment.countDocuments({
        video: new mongoose.Types.ObjectId(videoId)
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { comments: commentsAggregate, total, page, limit }, "Comments retrieved successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video doesn't exist")
    }
    const { content } = req.body
    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    })

    if (!comment) {
        throw new ApiError(500, "Couldn't add comment")
    }

    // Populate owner details for the response
    const populatedComment = await Comment.findById(comment._id)
        .populate("owner", "username fullName avatar")

    return res
        .status(201)
        .json(new ApiResponse(201, populatedComment, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body
    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    // Check if comment exists and user owns it
    const existingComment = await Comment.findById(commentId)
    if (!existingComment) {
        throw new ApiError(404, "Comment not found")
    }

    if (existingComment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You can only update your own comments")
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            content
        },
        {
            new: true
        }
    ).populate("owner", "username fullName avatar")

    if (!comment) {
        throw new ApiError(500, "Couldn't update comment")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, comment, "Comment updated successfully")
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params

    // Check if comment exists and user owns it
    const existingComment = await Comment.findById(commentId)
    if (!existingComment) {
        throw new ApiError(404, "Comment not found")
    }

    if (existingComment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You can only delete your own comments")
    }

    await Comment.findByIdAndDelete(commentId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Comment deleted successfully")
        )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}