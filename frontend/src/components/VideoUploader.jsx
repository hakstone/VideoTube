// import React, { useRef, useState } from "react";
// import API from "../api/api";
// import { toast } from "react-toastify";

// const VideoUploader = ({ onUploaded }) => {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     videoFile: null,
//     thumbnail: null,
//   });
//   const [uploading, setUploading] = useState(false);
//   const fileVideoRef = useRef();
//   const fileThumbRef = useRef();

//   const handleChange = (e) => {
//     if (e.target.name === "videoFile" || e.target.name === "thumbnail") {
//       setForm((f) => ({ ...f, [e.target.name]: e.target.files[0] }));
//     } else {
//       setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (
//       !form.title ||
//       !form.description ||
//       !form.videoFile ||
//       !form.thumbnail
//     ) {
//       toast.error("All fields are required!");
//       return;
//     }
//     const data = new FormData();
//     data.append("title", form.title);
//     data.append("description", form.description);
//     data.append("videoFile", form.videoFile);
//     data.append("thumbnail", form.thumbnail);

//     setUploading(true);
//     try {
//       await API.post("/videos", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Video uploaded!");
//       setForm({
//         title: "",
//         description: "",
//         videoFile: null,
//         thumbnail: null,
//       });
//       if (onUploaded) onUploaded();
//     } catch (err) {
//       toast.error("Failed to upload video");
//     }
//     setUploading(false);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-gray-800 rounded-lg p-4 md:p-6 lg:p-8 flex flex-col gap-3 md:gap-4 lg:gap-6 border border-gray-900 mb-4 md:mb-6"
//     >
//       <h2 className="font-bold text-fuchsia-600 text-lg md:text-xl lg:text-2xl mb-2">
//         Upload Video
//       </h2>

//       <div className="space-y-3 md:space-y-4">
//         <input
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           placeholder="Video Title"
//           className="w-full bg-gray-900 rounded-lg p-3 md:p-4 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm md:text-base"
//           required
//         />

//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Video Description"
//           className="w-full bg-gray-900 rounded-lg p-3 md:p-4 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm md:text-base resize-none"
//           rows={3}
//           required
//         />
//       </div>

//       <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
//         <div className="flex-1">
//           <button
//             type="button"
//             className="w-full px-3 py-2 md:px-4 md:py-3 bg-rose-600 hover:bg-rose-700 rounded-lg text-white cursor-pointer transition-colors text-sm md:text-base font-medium"
//             onClick={() => fileVideoRef.current.click()}
//           >
//             {form.videoFile ? "Change Video" : "Select Video"}
//           </button>
//           <input
//             ref={fileVideoRef}
//             type="file"
//             name="videoFile"
//             accept="video/*"
//             className="hidden"
//             onChange={handleChange}
//           />
//           {form.videoFile && (
//             <div className="text-xs md:text-sm text-gray-400 mt-2 truncate">
//               {form.videoFile.name}
//             </div>
//           )}
//         </div>

//         <div className="flex-1">
//           <button
//             type="button"
//             className="w-full px-3 py-2 md:px-4 md:py-3 bg-rose-600 hover:bg-rose-700 rounded-lg text-white cursor-pointer transition-colors text-sm md:text-base font-medium"
//             onClick={() => fileThumbRef.current.click()}
//           >
//             {form.thumbnail ? "Change Thumbnail" : "Select Thumbnail"}
//           </button>
//           <input
//             ref={fileThumbRef}
//             type="file"
//             name="thumbnail"
//             accept="image/*"
//             className="hidden"
//             onChange={handleChange}
//           />
//           {form.thumbnail && (
//             <div className="text-xs md:text-sm text-gray-400 mt-2 truncate">
//               {form.thumbnail.name}
//             </div>
//           )}
//         </div>
//       </div>

//       <button
//         type="submit"
//         className="w-full px-4 py-3 md:py-4 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 text-white font-bold mt-2 cursor-pointer transition-colors text-sm md:text-base disabled:cursor-not-allowed"
//         disabled={uploading}
//       >
//         {uploading ? (
//           <div className="flex items-center justify-center gap-2">
//             <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent"></div>
//             <span>Uploading...</span>
//           </div>
//         ) : (
//           "Upload"
//         )}
//       </button>
//     </form>
//   );
// };

// export default VideoUploader;

import React, { useRef, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

const VideoUploader = ({ onUploaded }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileVideoRef = useRef();
  const fileThumbRef = useRef();

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = "ddfs57yfnjm";
  const CLOUDINARY_UPLOAD_PRESET = "video_upload_preset"; // You'll need to create this

  const handleChange = (e) => {
    if (e.target.name === "videoFile" || e.target.name === "thumbnail") {
      setForm((f) => ({ ...f, [e.target.name]: e.target.files[0] }));
    } else {
      setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }
  };

  // Direct upload to Cloudinary with progress tracking
  const uploadToCloudinary = (file, resourceType = "auto") => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("resource_type", resourceType);

      if (resourceType === "video") {
        formData.append("folder", "videos");
      } else {
        formData.append("folder", "thumbnails");
      }

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          resolve(result);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`
      );
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.description ||
      !form.videoFile ||
      !form.thumbnail
    ) {
      toast.error("All fields are required!");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Upload thumbnail to Cloudinary
      setUploadStatus("Uploading thumbnail...");
      const thumbnailResult = await uploadToCloudinary(form.thumbnail, "image");

      // Step 2: Upload video to Cloudinary
      setUploadStatus("Uploading video...");
      setUploadProgress(0); // Reset progress for video upload
      const videoResult = await uploadToCloudinary(form.videoFile, "video");

      // Step 3: Send metadata to your backend
      setUploadStatus("Saving video details...");
      setUploadProgress(100);

      const videoData = {
        title: form.title,
        description: form.description,
        videoFile: videoResult.secure_url,
        thumbnail: thumbnailResult.secure_url,
        duration: videoResult.duration,
        publicId: videoResult.public_id,
        thumbnailPublicId: thumbnailResult.public_id,
      };

      await API.post("/videos/metadata", videoData, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Video uploaded successfully!");
      setForm({
        title: "",
        description: "",
        videoFile: null,
        thumbnail: null,
      });
      setUploadStatus("Upload complete!");

      if (onUploaded) onUploaded();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload video");
      setUploadStatus("Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus("");
      }, 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 rounded-lg p-4 md:p-6 lg:p-8 flex flex-col gap-3 md:gap-4 lg:gap-6 border border-gray-900 mb-4 md:mb-6"
    >
      <h2 className="font-bold text-fuchsia-600 text-lg md:text-xl lg:text-2xl mb-2">
        Upload Video
      </h2>

      <div className="space-y-3 md:space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Video Title"
          className="w-full bg-gray-900 rounded-lg p-3 md:p-4 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm md:text-base"
          required
          disabled={uploading}
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Video Description"
          className="w-full bg-gray-900 rounded-lg p-3 md:p-4 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm md:text-base resize-none"
          rows={3}
          required
          disabled={uploading}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="flex-1">
          <button
            type="button"
            className="w-full px-3 py-2 md:px-4 md:py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 rounded-lg text-white cursor-pointer transition-colors text-sm md:text-base font-medium disabled:cursor-not-allowed"
            onClick={() => fileVideoRef.current.click()}
            disabled={uploading}
          >
            {form.videoFile ? "Change Video" : "Select Video"}
          </button>
          <input
            ref={fileVideoRef}
            type="file"
            name="videoFile"
            accept="video/*"
            className="hidden"
            onChange={handleChange}
          />
          {form.videoFile && (
            <div className="text-xs md:text-sm text-gray-400 mt-2 truncate">
              {form.videoFile.name} (
              {(form.videoFile.size / (1024 * 1024)).toFixed(1)} MB)
            </div>
          )}
        </div>

        <div className="flex-1">
          <button
            type="button"
            className="w-full px-3 py-2 md:px-4 md:py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 rounded-lg text-white cursor-pointer transition-colors text-sm md:text-base font-medium disabled:cursor-not-allowed"
            onClick={() => fileThumbRef.current.click()}
            disabled={uploading}
          >
            {form.thumbnail ? "Change Thumbnail" : "Select Thumbnail"}
          </button>
          <input
            ref={fileThumbRef}
            type="file"
            name="thumbnail"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
          {form.thumbnail && (
            <div className="text-xs md:text-sm text-gray-400 mt-2 truncate">
              {form.thumbnail.name}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>{uploadStatus}</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-fuchsia-500 to-rose-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full px-4 py-3 md:py-4 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 text-white font-bold mt-2 cursor-pointer transition-colors text-sm md:text-base disabled:cursor-not-allowed"
        disabled={uploading}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent"></div>
            <span>Uploading...</span>
          </div>
        ) : (
          "Upload"
        )}
      </button>
    </form>
  );
};

export default VideoUploader;
