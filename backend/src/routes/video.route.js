// import { Router } from 'express'
// import { getAllVideos, publishAVideo, getVideoById, getVideoDetails, updateVideo, deleteVideo, togglePublishStatus } from '../controllers/video.controller.js'
// import { verifyJWT } from "../middlewares/auth.middleware.js"
// import { upload } from '../middlewares/multer.milldeware.js'

// const router = Router()

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router
//     .route('/')
//     .get(getAllVideos)
//     .post(
//         upload.fields([
//             {
//                 name: "videoFile",
//                 maxCount: 1
//             },
//             {
//                 name: "thumbnail",
//                 maxCount: 1
//             }
//         ]),
//         publishAVideo
//     )

// router
//     .route("/:videoId")
//     .get(getVideoById)
//     .delete(deleteVideo)
//     .patch(upload.single("thumbnail"), updateVideo);
// router.route("/:videoId/details").get(getVideoDetails);
// router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

// export default router


import { Router } from 'express'
import {
    getAllVideos,
    publishAVideo,
    saveVideoMetadata, // NEW import
    getVideoById,
    getVideoDetails,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from '../controllers/video.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from '../middlewares/multer.middleware.js' // Fixed typo from 'milldeware'

const router = Router()

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route('/')
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1
            },
            {
                name: "thumbnail",
                maxCount: 1
            }
        ]),
        publishAVideo
    )

// NEW: Route for handling metadata from direct Cloudinary uploads
router
    .route('/metadata')
    .post(saveVideoMetadata);

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/:videoId/details").get(getVideoDetails);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router