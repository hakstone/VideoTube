import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import API from "../api/api";
import ConfirmationModal from "./ConfirmationModal";
import { toast } from "react-toastify";
import { XMarkIcon } from "@heroicons/react/24/outline";

const VideoEditor = ({ videoId, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: null,
    isPublished: true,
  });
  const [originalVideo, setOriginalVideo] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const fileThumbRef = useRef();

  useEffect(() => {
    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/videos/${videoId}`);
      const video = res.data.data;
      setOriginalVideo(video);
      setForm({
        title: video.title,
        description: video.description,
        thumbnail: null,
        isPublished: video.isPublished,
      });
    } catch (error) {
      toast.error("Failed to fetch video details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (name === "thumbnail") {
      setForm((f) => ({ ...f, [name]: e.target.files[0] }));
    } else if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required!");
      return;
    }
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    if (form.thumbnail) {
      data.append("thumbnail", form.thumbnail);
    }
    setUpdating(true);
    try {
      await API.patch(`/videos/${videoId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Update publish status if changed
      if (form.isPublished !== originalVideo.isPublished) {
        await API.patch(`/videos/toggle/publish/${videoId}`);
      }
      toast.success("Video updated successfully!");
      if (onUpdated) onUpdated();
      if (onClose) onClose();
    } catch (error) {
      toast.error("Failed to update video");
    } finally {
      setUpdating(false);
    }
  };

  // const handleDelete = async () => {
  //   if (
  //     !window.confirm(
  //       "Are you sure you want to delete this video? This action cannot be undone."
  //     )
  //   ) {
  //     return;
  //   }
  //   try {
  //     await API.delete(`/videos/${videoId}`);
  //     toast.success("Video deleted successfully!");
  //     if (onUpdated) onUpdated();
  //     if (onClose) onClose();
  //   } catch (error) {
  //     toast.error("Failed to delete video");
  //   }
  // };

  const handleDelete = () => {
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/videos/${videoId}`);
      toast.success("Video deleted successfully!");
      if (onUpdated) onUpdated();
      if (onClose) onClose();
    } catch (error) {
      toast.error("Failed to delete video");
    } finally {
      setModalOpen(false);
    }
  };

  const togglePublishStatus = async () => {
    try {
      await API.patch(`/videos/toggle/publish/${videoId}`);
      const newStatus = !form.isPublished;
      setForm((f) => ({ ...f, isPublished: newStatus }));
      setOriginalVideo((prev) => ({ ...prev, isPublished: newStatus }));
      toast.success(
        `Video ${newStatus ? "published" : "unpublished"} successfully!`
      );
      if (onUpdated) onUpdated();
    } catch (error) {
      toast.error("Failed to update publish status");
    }
  };

  // Portal rendering
  return ReactDOM.createPortal(
    loading ? (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl p-6 md:p-8">
          <div className="text-white text-sm md:text-base">
            Loading video details...
          </div>
        </div>
      </div>
    ) : (
      <>
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700 sticky top-0 bg-gray-800 rounded-t-xl">
              <h2 className="text-lg md:text-xl font-bold text-white">
                Edit Video
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6">
              {/* Current Video Preview */}
              {originalVideo && (
                <div className="mb-4 md:mb-6">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-2">
                    <img
                      src={originalVideo.thumbnail}
                      alt={originalVideo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-sm text-gray-400 truncate">
                    Current: {originalVideo.title}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm md:text-base font-medium text-white mb-2">
                    Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter video title"
                    className="w-full bg-gray-900 rounded-lg p-3 md:p-4 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm md:text-base"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm md:text-base font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter video description"
                    className="w-full bg-gray-900 rounded-lg p-3 md:p-4 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm md:text-base resize-none"
                    rows={4}
                    required
                  />
                </div>

                {/* Thumbnail Update */}
                <div>
                  <label className="block text-sm md:text-base font-medium text-white mb-2">
                    Update Thumbnail (optional)
                  </label>
                  <button
                    type="button"
                    className="px-3 py-2 md:px-4 md:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors text-sm md:text-base"
                    onClick={() => fileThumbRef.current?.click()}
                  >
                    {form.thumbnail
                      ? "Change Thumbnail"
                      : "Select New Thumbnail"}
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
                      Selected: {form.thumbnail.name}
                    </div>
                  )}
                </div>

                {/* Publish Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={handleChange}
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                  />
                  <label className="text-sm md:text-base text-white">
                    Published (visible to public)
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 md:gap-4 pt-4">
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex-1 px-4 py-2.5 md:py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 rounded-lg text-white font-medium transition-colors text-sm md:text-base"
                    >
                      {updating ? "Updating..." : "Update Video"}
                    </button>

                    <button
                      type="button"
                      onClick={togglePublishStatus}
                      className={`flex-1 sm:flex-none px-4 py-2.5 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                        form.isPublished
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {form.isPublished ? "Unpublish" : "Publish"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full px-4 py-2.5 md:py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors text-sm md:text-base"
                  >
                    Delete Video
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <ConfirmationModal
          open={modalOpen}
          title="Delete Video"
          message="Are you sure you want to delete this video? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setModalOpen(false)}
        />
      </>
    ),
    document.body
  );
};

export default VideoEditor;
