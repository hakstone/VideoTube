// import mongoose, { isValidObjectId } from 'mongoose'
// import { ApiError } from "../utils/ApiError.js"
// import { ApiResponse } from "../utils/ApiResponse.js"
// import { Video } from "../models/video.model.js"
// import { User } from "../models/user.model.js"
// import { asyncHandler } from '../utils/asyncHandler.js'
// import { uploadOnCloudinary } from '../utils/cloudinary.js'


// const getAllVideos = asyncHandler(async (req, res) => {
//     const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
//     //TODO: get all videos based on query, sort, pagination

//     if (userId && !isValidObjectId(userId)) {
//         throw new ApiError(401, "Invalid userId")
//     }

//     const queryObject = {}
//     if (query) {
//         queryObject.$or = [
//             {
//                 title: {
//                     $regex: query,
//                     $options: 'i'
//                 }
//             },
//             {
//                 description: {
//                     $regex: query,
//                     $options: 'i'
//                 }
//             }
//         ]
//     }



//     if (userId) {
//         queryObject.owner = new mongoose.Types.ObjectId(userId)
//     }
//     // console.log("Video query object : ", queryObject);

//     const skip = (page - 1) * limit

//     const videos = await Video.find(queryObject)
//         .sort({ [sortBy]: sortType === 'asc' ? 1 : -1 })
//         .skip(skip)
//         .limit(parseInt(limit))

//     if (!videos) {
//         throw new ApiError(500, "Couldn't fetch the videos")
//     }


//     const totalVideos = await Video.countDocuments(queryObject)

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(200, { videos, totalVideos, page, limit }, "Videos fetched successfully")
//         )
// })

// const publishAVideo = asyncHandler(async (req, res) => {
//     const { title, description } = req.body
//     // TODO: get video, upload to cloudinary, create video

//     const userId = req.user?._id
//     if (!userId) {
//         throw new ApiError(400, "User not authenticated")
//     }

//     if ([title, description].some((field) =>
//         field?.trim() === "")) {
//         throw new ApiError(400, "Title and description are required")
//     }

//     const videoLocalPath = req.files?.videoFile[0]?.path
//     if (!videoLocalPath) {
//         throw new ApiError(400, "Video file is required")
//     }

//     const thumbnailLocalPath = req.files?.thumbnail[0]?.path
//     if (!thumbnailLocalPath) {
//         throw new ApiError(400, "Thumbnail file is required")
//     }

//     const videoFile = await uploadOnCloudinary(videoLocalPath)
//     const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

//     if (!(videoFile && thumbnail)) {
//         throw new ApiError(500, "Failed to upload video and thumbnail to cloudinary")
//     }


//     const video = await Video.create({
//         title,
//         description,
//         videoFile: videoFile.url,
//         thumbnail: thumbnail.url,
//         duration: videoFile.duration,
//         owner: userId,
//         views: 0,
//     })

//     if (!video) {
//         throw new ApiError(500, "Couldn't upload the video")
//     }

//     return res
//         .status(201)
//         .json(
//             new ApiResponse(200, video, "Video published successfully")
//         )
// })

// const getVideoById = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     if (!isValidObjectId(videoId)) {
//         throw new ApiError(401, "Invalid videoId")
//     }
//     //TODO: get video by id
//     const video = await Video.findById(videoId)
//     if (!video) {
//         throw new ApiError(404, "Video not found")
//     }

//     video.views += 1
//     await video.save()

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(200, video, "Video found")
//         )

// })

// const updateVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     if (!isValidObjectId(videoId)) {
//         throw new ApiError(401, "Invalid videoId")
//     }
//     //TODO: update video details like title, description, thumbnail

//     const { title, description } = req.body
//     if ([title, description].some((field) =>
//         field.trim() === "")) {
//         throw new ApiError(400, "Title and description are required")
//     }

//     const thumbnailLocalPath = req.file?.path
//     if (!thumbnailLocalPath) {
//         throw new ApiError(400, "Thumbnail file is required")
//     }

//     const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
//     if (!thumbnail) {
//         throw new ApiError(500, "Failed to upload thumbnail to cloudinary")
//     }

//     const video = await Video.findByIdAndUpdate(
//         videoId,
//         {
//             $set: {
//                 title,
//                 description,
//                 thumbnail: thumbnail.url
//             }
//         },
//         {
//             new: true
//         }
//     )

//     if (!video) {
//         throw new ApiError(500, "Couldn't update video")
//     }

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(200, video, "Video updated successfully")
//         )
// })

// const deleteVideo = asyncHandler(async (req, res) => {
//     const { videoId } = req.params
//     //TODO: delete video
//     const deletedVideo = await Video.findByIdAndDelete(videoId)
//     if (!deletedVideo) {
//         throw new ApiError(404, "Video not found")
//     }

//     // console.log(deletedVideo);


//     return res
//         .status(200)
//         .json(
//             new ApiResponse(200, {}, "Video deleted successfully")
//         )
// })

// const togglePublishStatus = asyncHandler(async (req, res) => {
//     const { videoId } = req.params

//     const video = await Video.findById(videoId)
//     if (!video) {
//         throw new ApiError(404, "Video not found")
//     }

//     video.isPublished = !video.isPublished
//     await video.save()

//     return res
//         .status(200)
//         .json(
//             new ApiResponse(200, video, "Video publish status updated successfully")
//         )
// })

// export {
//     getAllVideos,
//     publishAVideo,
//     getVideoById,
//     updateVideo,
//     deleteVideo,
//     togglePublishStatus
// }


import mongoose, { isValidObjectId } from 'mongoose'
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { Like } from "../models/like.model.js"
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    if (userId && !isValidObjectId(userId)) {
        throw new ApiError(401, "Invalid userId")
    }

    const queryObject = {}
    if (query) {
        queryObject.$or = [
            {
                title: {
                    $regex: query,
                    $options: 'i'
                }
            },
            {
                description: {
                    $regex: query,
                    $options: 'i'
                }
            }
        ]
    }

    if (userId) {
        queryObject.owner = new mongoose.Types.ObjectId(userId)
    }
    // console.log("Video query object : ", queryObject);

    const skip = (page - 1) * limit

    const videos = await Video.find(queryObject)
        .populate("owner", "username fullName avatar") // Populate owner details
        .sort({ [sortBy]: sortType === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(parseInt(limit))

    if (!videos) {
        throw new ApiError(500, "Couldn't fetch the videos")
    }

    const totalVideos = await Video.countDocuments(queryObject)

    return res
        .status(200)
        .json(
            new ApiResponse(200, { videos, totalVideos, page, limit }, "Videos fetched successfully")
        )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video

    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(400, "User not authenticated")
    }

    if ([title, description].some((field) =>
        field?.trim() === "")) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!(videoFile && thumbnail)) {
        throw new ApiError(500, "Failed to upload video and thumbnail to cloudinary")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: userId,
        views: 0,
    })

    if (!video) {
        throw new ApiError(500, "Couldn't upload the video")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, video, "Video published successfully")
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(401, "Invalid videoId")
    }

    // Use aggregation to get video with owner details and likes count
    const videoAggregate = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
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
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                likesCount: {
                    $size: "$likes"
                }
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                videoFile: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: 1,
                likesCount: 1
            }
        }
    ])

    if (!videoAggregate || videoAggregate.length === 0) {
        throw new ApiError(404, "Video not found")
    }

    const video = videoAggregate[0]

    // await Video.findByIdAndUpdate(videoId, {
    //     $inc: { views: 1 }
    // })

    // if (req.user?._id) {
    //     try {
    //         await User.findByIdAndUpdate(req.user._id, {
    //             $addToSet: {
    //                 watchHistory: videoId // addToSet prevents duplicates
    //             }
    //         })
    //     } catch (error) {
    //         console.error("Error updating watch history:", error);
    //     }
    // }

    // video.views += 1

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video found")
        )
})

const getVideoDetails = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;

    // Fetch video
    const video = await Video.findById(videoId).populate('owner');
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Get like count
    const likesCount = await Like.countDocuments({ video: videoId });

    // Check if current user has liked
    let isLiked = false;
    if (req.user?._id) {
        isLiked = !!(await Like.findOne({
            video: videoId,
            likedBy: req.user._id
        }));
    }

    await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 }
    })

    if (req.user?._id) {
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { watchHistory: videoId }
        })
    }

    video.views += 1;

    return res.status(200).json(
        new ApiResponse(200, {
            ...video.toObject(),
            likes: likesCount,
            isLiked,
        }, "Video fetched successfully")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(401, "Invalid videoId")
    }
    //TODO: update video details like title, description, thumbnail

    const { title, description } = req.body
    if ([title, description].some((field) =>
        field.trim() === "")) {
        throw new ApiError(400, "Title and description are required")
    }

    const existingVideo = await Video.findById(videoId);
    if (!existingVideo) {
        throw new ApiError(404, "Video not found")
    }

    let thumbnailUrl = existingVideo.thumbnail;
    if (req.file?.path) {
        const thumbnail = await uploadOnCloudinary(req.file.path);
        if (!thumbnail) {
            throw new ApiError(500, "Failed to upload thumbnail to cloudinary")
        }
        thumbnailUrl = thumbnail.url;
    }

    // const thumbnailLocalPath = req.file?.path
    // if (!thumbnailLocalPath) {
    //     throw new ApiError(400, "Thumbnail file is required")
    // }

    // const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    // if (!thumbnail) {
    //     throw new ApiError(500, "Failed to upload thumbnail to cloudinary")
    // }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnailUrl
            }
        },
        {
            new: true
        }
    ).populate("owner", "username fullName avatar")

    if (!video) {
        throw new ApiError(500, "Couldn't update video")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video updated successfully")
        )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const deletedVideo = await Video.findByIdAndDelete(videoId)
    if (!deletedVideo) {
        throw new ApiError(404, "Video not found")
    }

    // console.log(deletedVideo);

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Video deleted successfully")
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video publish status updated successfully")
        )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    getVideoDetails,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}