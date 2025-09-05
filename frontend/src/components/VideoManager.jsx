import React, { useState } from "react";
import VideoEditor from "./VideoEditor";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ConfirmationModal from "./ConfirmationModal";
import API from "../api/api";
import { toast } from "react-toastify";

const VideoManager = ({ video, onUpdated }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  if (!video) return null;

  const handleDelete = () => {
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/videos/${video._id}`);
      toast.success("Video deleted successfully!");
      if (onUpdated) onUpdated();
    } catch (error) {
      toast.error("Failed to delete video");
    } finally {
      setDeleting(false);
      setModalOpen(false);
    }
  };

  return (
    <div className="text-black">
      <div className="absolute top-2 right-2 flex gap-1 md:gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          className="bg-white/90 hover:bg-white text-black p-1.5 md:p-2 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
          title="Edit"
          onClick={() => setShowEditor(true)}
        >
          <PencilIcon className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white p-1.5 md:p-2 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <div className="animate-spin rounded-full w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent" />
          ) : (
            <TrashIcon className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
          )}
        </button>
      </div>

      {showEditor && (
        <VideoEditor
          videoId={video._id}
          onClose={() => setShowEditor(false)}
          onUpdated={onUpdated}
        />
      )}
      <ConfirmationModal
        open={modalOpen}
        title="Delete Video"
        message="Are you sure you want to delete this video? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

export default VideoManager;
