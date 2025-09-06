// import express from 'express'
// import cors from 'cors'
// import cookieParser from 'cookie-parser'

// const app = express()

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     // origin: "http://localhost:5173",
//     // origin: "https://video-tube-hf9u.vercel.app",
//     credentials: true
// }))

// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"))
// app.use(cookieParser())
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()


// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.CORS_ORIGIN,
            'https://video-tube-hf9u.vercel.app',
            'http://localhost:5173',
            'http://localhost:3000'
        ].filter(Boolean); // Remove any undefined values

        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization'
    ]
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))
app.use(cookieParser())


// importing routes
import userRouter from './routes/user.route.js'
import videoRouter from "./routes/video.route.js"
import commentRouter from "./routes/comment.route.js"
import tweetRouter from './routes/tweet.route.js'
import likeRouter from './routes/like.route.js'
import playlistRouter from './routes/playlist.route.js'
import subscriptionRouter from "./routes/subscription.route.js"
import healthcheckRouter from "./routes/healthcheck.route.js"
import dashboardRouter from './routes/dashboard.route.js'

// routes declaration
app.use('/api/v1/users', userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.get('/', (req, res) =>
    res.send('Server is Live! ')
);
// http://localhost:8000/api/v1/users/register

export { app }