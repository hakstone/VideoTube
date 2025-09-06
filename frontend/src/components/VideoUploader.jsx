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
  const fileVideoRef = useRef();
  const fileThumbRef = useRef();

  const handleChange = (e) => {
    if (e.target.name === "videoFile" || e.target.name === "thumbnail") {
      setForm((f) => ({ ...f, [e.target.name]: e.target.files[0] }));
    } else {
      setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }
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
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("videoFile", form.videoFile);
    data.append("thumbnail", form.thumbnail);

    setUploading(true);
    try {
      await API.post("/videos", data, {
        // headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Video uploaded!");
      setForm({
        title: "",
        description: "",
        videoFile: null,
        thumbnail: null,
      });
      if (onUploaded) onUploaded();
    } catch (err) {
      toast.error("Failed to upload video");
    }
    setUploading(false);
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
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Video Description"
          className="w-full bg-gray-900 rounded-lg p-3 md:p-4 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm md:text-base resize-none"
          rows={3}
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="flex-1">
          <button
            type="button"
            className="w-full px-3 py-2 md:px-4 md:py-3 bg-rose-600 hover:bg-rose-700 rounded-lg text-white cursor-pointer transition-colors text-sm md:text-base font-medium"
            onClick={() => fileVideoRef.current.click()}
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
              {form.videoFile.name}
            </div>
          )}
        </div>

        <div className="flex-1">
          <button
            type="button"
            className="w-full px-3 py-2 md:px-4 md:py-3 bg-rose-600 hover:bg-rose-700 rounded-lg text-white cursor-pointer transition-colors text-sm md:text-base font-medium"
            onClick={() => fileThumbRef.current.click()}
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
