import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton";
import VideoEditor from "../components/VideoEditor";
import ConfirmatioModal from "../components/ConfirmationModal";
import { useAuth } from "../store/auth";
import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const VideoDetails = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/videos/${videoId}/details`);
      setVideo(res.data.data);
      setIsLiked(res.data.data.isLiked);
      setLikes(res.data.data.likes);
    } catch (error) {
      console.error("Error fetching video:", error);
      toast.error("Failed to load video");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

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
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Error deleting video:", error);
  //     toast.error("Failed to delete video");
  //   }
  // };

  const handleDelete = async () => {
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/videos/${videoId}`);
      toast.success("Video deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    } finally {
      setModalOpen(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await API.patch(`/videos/toggle/publish/${videoId}`);
      const newStatus = !video.isPublished;
      setVideo((prev) => ({ ...prev, isPublished: newStatus }));
      toast.success(
        `Video ${newStatus ? "published" : "unpublished"} successfully!`
      );
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update publish status");
    }
  };

  const handleLike = async () => {
    try {
      await API.post(`/likes/toogle/v/${videoId}`);
      setIsLiked((prev) => !prev);
      fetchVideo(); // Refresh to get updated like count
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
    }
  };

  const handleVideoUpdated = () => {
    fetchVideo(); // Refresh video data
    setShowEditor(false);
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
        <div className="aspect-video bg-gray-800 rounded-lg animate-pulse mb-4 sm:mb-6"></div>
        <div className="bg-gray-800 h-6 sm:h-8 rounded animate-pulse mb-2"></div>
        <div className="bg-gray-800 h-4 rounded animate-pulse w-1/2 sm:w-1/3"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="text-white text-lg sm:text-xl mb-4">
            Video not found
          </div>
          <Link
            to="/"
            className="text-rose-600 hover:text-rose-400 transition-colors duration-200 text-sm sm:text-base"
          >
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && user._id === video.owner?._id;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 sm:mb-6">
        <video
          src={video.videoFile}
          poster={video.thumbnail}
          controls
          className="w-full h-full"
          onError={(e) => {
            console.error("Video playback error:", e);
            toast.error("Error loading video");
          }}
        />
      </div>

      {/* Video Info Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-2 sm:mb-3 break-words leading-tight">
            {video.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{video.views || 0} views</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            {isOwner && (
              <>
                <span className="hidden sm:inline">•</span>
                <div
                  className={`flex items-center gap-1 ${
                    video.isPublished ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {video.isPublished ? (
                    <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <EyeSlashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  <span>{video.isPublished ? "Published" : "Unpublished"}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex flex-wrap gap-2 sm:gap-3 lg:flex-col lg:w-auto">
            <button
              onClick={() => setShowEditor(true)}
              className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Edit</span>
            </button>

            <button
              onClick={handleTogglePublish}
              className={`flex-1 sm:flex-none px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm ${
                video.isPublished
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {video.isPublished ? (
                <EyeSlashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span>{video.isPublished ? "Unpublish" : "Publish"}</span>
            </button>

            <button
              onClick={handleDelete}
              className="flex-1 sm:flex-none px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Video Description */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <p className="text-gray-300 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
          {video.description}
        </p>
      </div>

      {/* Channel Info and Like Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        {/* Channel Info */}
        {video.owner && (
          <Link
            to={`/channel/${video.owner.username}`}
            className="flex items-center gap-3 text-teal-400 hover:text-teal-300 transition-colors duration-200 min-w-0"
          >
            <img
              src={video.owner.avatar || "/default-avatar.png"}
              alt={video.owner.username}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-700 flex-shrink-0"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className="min-w-0">
              <div className="font-semibold text-sm sm:text-base truncate">
                {video.owner.username}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {video.owner.fullName}
              </div>
            </div>
          </Link>
        )}

        {/* Like Button */}
        <div className="flex items-center justify-center sm:justify-end">
          <LikeButton liked={isLiked} onClick={handleLike} count={likes || 0} />
        </div>
      </div>

      {/* Comments Section */}
      <div className="w-full">
        <CommentSection videoId={videoId} />
      </div>

      {/* Video Editor Modal */}
      {showEditor && (
        <VideoEditor
          videoId={videoId}
          onClose={() => setShowEditor(false)}
          onUpdated={handleVideoUpdated}
        />
      )}
      <ConfirmatioModal
        open={modalOpen}
        title="Delete Video"
        message="Are you sure you want to delete this video? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

export default VideoDetails;
