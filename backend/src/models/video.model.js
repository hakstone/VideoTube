// import mongoose, { Schema } from 'mongoose'
// import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'


// const videoSchema = new Schema({
//     videoFile: {
//         type: String, //cloudinary url
//         required: true
//     },
//     thumbnail: {
//         type: String, //cloudinary url
//         required: true
//     },
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     duration: {
//         type: Number, //from cloudinary 
//         required: true
//     },
//     views: {
//         type: Number,
//         default: 0
//     },
//     isPublished: {
//         type: Boolean,
//         default: true
//     },
//     owner: {
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     }
// }, { timestamps: true })

// videoSchema.plugin(mongooseAggregatePaginate)

// export const Video = mongoose.model("Video", videoSchema)

import mongoose, { Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new Schema({
    videoFile: {
        type: String, //cloudinary url
        required: true
    },
    thumbnail: {
        type: String, //cloudinary url
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number, //from cloudinary 
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // NEW: Store Cloudinary public IDs for future operations (delete, transform, etc.)
    publicId: {
        type: String, // Cloudinary public_id for the video
        required: false
    },
    thumbnailPublicId: {
        type: String, // Cloudinary public_id for the thumbnail
        required: false
    }
}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)