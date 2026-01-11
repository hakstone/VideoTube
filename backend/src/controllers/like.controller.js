import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { Like } from '../models/like.model.js'
import mongoose, { isValidObjectId } from 'mongoose'

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideosAggregate = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: 'videos',
                localField: "video",
                foreignField: "_id",
                as: "likedVideos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails"
                        }
                    },
                    {
                        $unwind: "$ownerDetails"
                    }
                ]
            }
        },
        {
            $unwind: "$likedVideos"
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                likedVideos: {
                    _id: 1,
                    videoFile: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    duration: 1,
                    createdAt: 1,
                    isPublished: 1,
                    ownerDetails: {
                        username: 1,
                        fullName: 1,
                        email: 1,
                        avatar: 1
                    },
                }
            }
        }
    ])

    if (!likedVideosAggregate) {
        throw new ApiError(500, "Couldn't get liked videos")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideosAggregate,
                "Liked Videos Fetched successfully"
            )
        )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(401, "Invalid comment ID")
    }

    const likedAlready = await Like.findOne(
        {
            comment: commentId,
            likedBy: req.user?._id
        }
    )

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready?._id)

        return res
            .status(200)
            .json(
                new ApiResponse(200, { isLiked: false }, "Like removed successfully")
            )
    }

    const like = await Like.create({
        comment: commentId,
        likedBy: req.user?._id
    })
    if (!like) {
        throw new ApiError(500, "Couldn't like the comment")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, { like, isLiked: true }, "Comment liked successfully")
        )
})

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(401, "Invalid video ID")
    }

    const likedAlready = await Like.findOne(
        {
            video: new mongoose.Types.ObjectId(videoId),
            likedBy: req.user?._id
        }
    )

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready?._id)

        return res
            .status(200)
            .json(
                new ApiResponse(200, { isLiked: false }, "Like removed")
            )
    }

    const like = await Like.create({
        video: videoId,
        likedBy: req.user?._id
    })
    if (!like) {
        throw new ApiError(500, "Couldn't like the video")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, { like, isLiked: true }, "Video liked successfully")
        )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }

    const likedAlready = await Like.findOne({
        tweet: new mongoose.Types.ObjectId(tweetId),
        likedBy: req.user?._id,
    });

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready?._id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200, { isLiked: false },
                    "Like removed successfully"
                )
            );
    }


    const like = await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id,
    });
    if (!like) {
        throw new ApiError(500, "Couldn't like the tweet")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { like, isLiked: true },
                "Tweet liked successfully"
            )
        );
})

export {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike
}