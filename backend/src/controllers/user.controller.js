import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from '../models/user.model.js'
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: "jhinga lala hu hu!!"
    // })

    // get the details from the user from frontend (we will use postman)
    // validate the data : not empty
    // check if the user already exists in the database : username or email
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create an entry in database(MongoDB)
    // check for user creation
    // return response

    const { fullName, username, password, email } = req.body;
    // console.log(req)


    // for validation : this some method returns boolean value for each field
    if ([fullName, username, password, email].some((field) =>
        field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    // check for user existence
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]    //this will return the first instance of matched username or email
    })
    if (existedUser) {
        throw new ApiError(409, "User with username or email already exist")
    }

    // images and avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(avatarLocalPath);

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        password,
        email
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"               // minus represents which fields not to show 
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
});

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
}

const loginUser = asyncHandler(async (req, res) => {

    // get the data from req.body
    // username or email based login
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const { username, password, email } = req.body
    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    // localStorage.setItem("accessToken", accessToken);
    // localStorage.setItem("refreshToken", refreshToken);


    // this loggedInUser will contain all the details (access and refresh token but we will not show password and refresh token to user)
    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken ")

    // sending cookies to user
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }


    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            ))
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1  // this removes the field from document
            }
        },
        {
            new: true     //this will return the new updated value in response
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
})

// to refresh the access token
const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is not valid or expired")
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        // console.log("New refresh token is : ", newRefreshToken);


        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken
                    },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, "Invalid Refresh Token")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Old password is incorrect")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password changed successfully"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "user fetched successfully"
            )
        )
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {
            new: true,
        }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User details updated successfully"
            )
        )
})


const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarToBeDeleted = req.user.avatar;

    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(500, "Error while uploading avatar on cloudinary")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password")


    await deleteFromCloudinary(avatarToBeDeleted)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Avatar image updated successfully"
            )
        )
})

const updateUserCoverImage = asyncHandler(async (req, res) => {

    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "cover Image file is missing")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "CoverImage image updated successfully"
            )
        )
})

const getUserChannelProfile = asyncHandler(async (req, res) => {

    const { username } = req.params
    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing")
    }

    // const channel = await User.aggregate([
    //     {
    //         $match: {
    //             username: username?.toLowerCase()
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "videos",
    //             localField: '_id',
    //             foreignField: 'owner',
    //             as: 'videos'
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "subscriptions",
    //             localField: "_id",
    //             foreignField: "channel",
    //             as: "subscribers"
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "subscriptions",
    //             localField: "_id",
    //             foreignField: "subscriber",
    //             as: "subscribedTo"
    //         }
    //     },
    //     {
    //         $addFields: {
    //             subscribersCount: {
    //                 $size: "$subscribers"
    //             },
    //             channelSubscribedToCount: {
    //                 $size: "$subscribedTo"
    //             },
    //             isSubscribed: {
    //                 $cond: {
    //                     if: { $in: [req.user?._id, "$subscribers.subscriber"] },
    //                     then: true,
    //                     else: false
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $project: {
    //             fullName: 1,
    //             username: 1,
    //             subscribersCount: 1,
    //             channelSubscribedToCount: 1,
    //             isSubscribed: 1,
    //             email: 1,
    //             avatar: 1,
    //             coverImage: 1,
    //             videos: 1
    //         }
    //     }
    // ])
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos",
                pipeline: [
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
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: { $arrayElemAt: ["$owner", 0] }
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                channelSubscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                videos: 1
            }
        }
    ]);


    // console.log("Channel : ", channel);

    if (!channel?.length) {
        throw new ApiError(404, "Channel doesn't exist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channel[0],
                "User channel fetched successfully"
            )
        )

})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
                // MongoDb gives us the string in _id that's why we have used mongoose ObjectId here
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },

                    // this pipeline will overwrite the owner property and add a new property named owner so that it will be easier for the frontend user to fetch the details
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"   //first adds the first property of the array
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watch History Fetched Successfully",
            )
        )

})

const removeFromWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const userId = req.user?._id;
    await User.findByIdAndUpdate(userId, {
        $pull: { watchHistory: new mongoose.Types.ObjectId(videoId) }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video removed from watch history"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    removeFromWatchHistory,
}