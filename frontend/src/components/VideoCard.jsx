import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import AddToPlaylistButton from "./AddToPlaylistButton";
import VideoEditor from "./VideoEditor";
import { useAuth } from "../store/auth";
import API from "../api/api";
import { toast } from "react-toastify";

// Separate component for video actions
const VideoCardActions = ({ video }) => {
  const { user } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isOwner = user && user._id === video.owner?._id;

  const openConfirmModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => setShowConfirmModal(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await API.delete(`/videos/${video._id}`);
      toast.success("Video deleted successfully!");
      if (window.location.reload) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    } finally {
      setIsDeleting(false);
      closeConfirmModal();
    }
  };

  const handleTogglePublish = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await API.patch(`/videos/toggle/publish/${video._id}`);
      toast.success(
        `Video ${video.isPublished ? "unpublished" : "published"}!`
      );
      if (window.location.reload) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update publish status");
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditor(true);
  };

  return (
    <div className="px-3 md:px-4 pb-3 md:pb-4">
      <div className="flex items-center justify-between gap-2">
        {/* Add to Playlist Button (for all users) */}
        <div className="flex-1">
          <AddToPlaylistButton videoId={video._id} />
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={handleEdit}
              className="p-1.5 md:p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              title="Edit video"
            >
              <PencilIcon className="w-3 h-3 md:w-4 md:h-4" />
            </button>

            <button
              onClick={handleTogglePublish}
              className={`p-1.5 md:p-2 rounded-lg transition-colors ${
                video.isPublished
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              title={video.isPublished ? "Unpublish video" : "Publish video"}
            >
              {video.isPublished ? (
                <EyeSlashIcon className="w-3 h-3 md:w-4 md:h-4" />
              ) : (
                <EyeIcon className="w-3 h-3 md:w-4 md:h-4" />
              )}
            </button>

            <button
              onClick={openConfirmModal}
              disabled={isDeleting}
              className="p-1.5 md:p-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg transition-colors"
              title="Delete video"
            >
              <TrashIcon className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <Dialog
          open={showConfirmModal}
          onClose={closeConfirmModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <Dialog.Panel className="bg-gray-900 p-6 rounded-lg max-w-sm mx-auto text-white">
            <Dialog.Title className="text-lg font-semibold">
              Confirm Delete
            </Dialog.Title>
            <Dialog.Description className="mt-2 mb-4">
              Are you sure you want to delete "{video.title}"? This action
              cannot be undone.
            </Dialog.Description>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      )}

      {/* Video Editor Modal */}
      {showEditor && (
        <VideoEditor
          videoId={video._id}
          onClose={() => setShowEditor(false)}
          onUpdated={() => {
            setShowEditor(false);
            if (window.location.reload) {
              window.location.reload();
            }
          }}
        />
      )}
    </div>
  );
};

const VideoCard = ({ video, showActions = true }) => {
  const formatDuration = (duration) => {
    if (!duration) return "--:--";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] w-full">
      {/* Video Thumbnail and Link */}
      <Link to={`/video/${video._id}`} className="block">
        <div className="aspect-video relative bg-gray-900 overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Duration Badge */}
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded font-medium backdrop-blur-sm">
            {formatDuration(video.duration)}
          </span>

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Video Info */}
        <div className="p-3 md:p-4">
          <h3 className="text-white font-semibold line-clamp-2 mb-2 group-hover:text-rose-300 transition-colors text-sm md:text-base lg:text-lg">
            {video.title}
          </h3>

          <p className="text-xs md:text-sm text-gray-400 line-clamp-2 mb-3 min-h-[2rem] md:min-h-[2.5rem]">
            {video.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs md:text-sm text-gray-500 gap-1 sm:gap-2">
            <div className="flex items-center gap-1">
              <EyeIcon className="w-3 h-3 flex-shrink-0" />
              <span>{formatViews(video.views || 0)} views</span>
            </div>
            <span className="text-xs truncate">
              {new Date(video.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>

      {/* Action Buttons - Outside the video card content */}
      {showActions && <VideoCardActions video={video} />}
    </div>
  );
};

export default VideoCard;
