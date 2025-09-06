// import { v2 as cloudinary } from 'cloudinary'
// import fs from 'fs'   //fs is file system which is provided by node js

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET 
// });


// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
//         // upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: 'auto',
//         })
//         // console.log(response);

//         // file has been uploaded successfully
//         // console.log("File has been uploaded on cloudinary ", response);
//         fs.unlinkSync(localFilePath)
//         return response
//     } catch (error) {
//         // this will remove the locally saved temporary file as the upload operation got failed
//         fs.unlinkSync(localFilePath)
//         console.error("ERRR ", error)
//         return null
//     }
// }

// const deleteFromCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null

//         // delete the file from cloudinary
//         cloudinary.uploader.destroy(localFilePath, function (result) { console.log(result) });
//     } catch (error) {
//         console.error("ERRR ", error)
//         return null
//     }
// }


// export { uploadOnCloudinary, deleteFromCloudinary }




// cloudinary.js
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        })

        // file has been uploaded successfully
        console.log("File uploaded to Cloudinary:", response.public_id);

        // Clean up the temp file - add error handling
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath)
                console.log("Temp file deleted:", localFilePath);
            }
        } catch (unlinkError) {
            console.error("Error deleting temp file:", unlinkError);
            // Don't throw here, upload was successful
        }

        return response
    } catch (error) {
        console.error("Cloudinary upload error:", error)

        // Try to clean up temp file even on error
        try {
            if (localFilePath && fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath)
            }
        } catch (unlinkError) {
            console.error("Error cleaning up temp file:", unlinkError);
        }

        return null
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null

        // delete the file from cloudinary
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'auto'
        });
        console.log("Deleted from Cloudinary:", result);
        return result;
    } catch (error) {
        console.error("Cloudinary delete error:", error)
        return null
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }