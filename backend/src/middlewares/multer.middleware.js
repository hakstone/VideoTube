import multer from 'multer'

const storage = multer.diskStorage({
    // cb here is a callback function 
    // syntax --> (parameter) cb: (error: Error | null, destination: string) => void
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage: storage
})

