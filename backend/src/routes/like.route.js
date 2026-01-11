import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { getLikedVideos, toggleCommentLike, toggleVideoLike, toggleTweetLike, } from "../controllers/like.controller.js"

const router = Router()

router.use(verifyJWT)

router.route('/videos').get(getLikedVideos)
router.route('/toogle/c/:commentId').post(toggleCommentLike)
router.route('/toogle/v/:videoId').post(toggleVideoLike)
router.route('/toogle/t/:tweetId').post(toggleTweetLike)

export default router