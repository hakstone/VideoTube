import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { Like } from "../models/like.model.js" // Add this import
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    })

    if (!tweet) {
        throw new ApiError(500, "failed to create tweet please try again");
    }

    // Populate owner details for the response
    const populatedTweet = await Tweet.findById(tweet._id)
        .populate("owner", "username fullName avatar")

    return res
        .status(200)
        .json(
            new ApiResponse(200, populatedTweet, "Tweet created successfully")
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User id is not valid")
    }

    const skip = (page - 1) * limit

    // Use aggregation to get tweets with owner details, likes count, and user's like status
    const tweetsAggregate = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
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
                foreignField: "tweet",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "likes",
                let: { tweetId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$tweet", "$$tweetId"] },
                                    { $eq: ["$likedBy", new mongoose.Types.ObjectId(req.user?._id)] }
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
                owner: 1,
                likesCount: 1,
                isLiked: 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: parseInt(limit)
        }
    ])

    const total = await Tweet.countDocuments({
        owner: new mongoose.Types.ObjectId(userId)
    })

    if (!tweetsAggregate) {
        throw new ApiError(500, "Couldn't get the tweets")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, { tweets: tweetsAggregate, total, page, limit }, "Tweets fetched successfully")
        )
})

const getAllTweets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    // Get all tweets with owner details, likes count, and user's like status
    const tweetsAggregate = await Tweet.aggregate([
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
                foreignField: "tweet",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "likes",
                let: { tweetId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$tweet", "$$tweetId"] },
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
                owner: 1,
                likesCount: 1,
                isLiked: 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: parseInt(limit)
        }
    ])

    const total = await Tweet.countDocuments()

    return res
        .status(200)
        .json(
            new ApiResponse(200, { tweets: tweetsAggregate, total, page, limit }, "All tweets fetched successfully")
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(401, "Invalid tweetId")
    }

    const { content } = req.body
    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content,
        },
        {
            new: true
        }
    ).populate("owner", "username fullName avatar")

    if (!tweet) {
        throw new ApiError(500, "Couldn't update the tweet")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "Tweet updated successfully")
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(401, "Invalid tweetId")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if (!deletedTweet) {
        throw new ApiError(404, "Tweet not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Tweet deleted successfully")
        )
})

export {
    createTweet,
    getUserTweets,
    getAllTweets, // Added this new function
    updateTweet,
    deleteTweet
}