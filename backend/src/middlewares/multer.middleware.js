// import multer from 'multer'

// const storage = multer.diskStorage({
//     // cb here is a callback function 
//     // syntax --> (parameter) cb: (error: Error | null, destination: string) => void
//     destination: function (req, file, cb) {
//         cb(null, './public/temp')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// })

// export const upload = multer({
//     storage: storage
// })

import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use /tmp directory on Vercel instead of ./public/temp
        cb(null, '/tmp')
    },
    filename: function (req, file, cb) {
        // Add timestamp to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 4 * 1024 * 1024 // 4MB limit for Vercel
    }
})