import React, { useState } from "react";
import VideoEditor from "./VideoEditor";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import API from "../api/api";
import { toast } from "react-toastify";

const VideoManager = ({ video, onUpdated }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!video) return null;

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      await API.delete(`/videos/${video._id}`);
      toast.success("Video deleted successfully!");
      if (onUpdated) onUpdated();
    } catch (error) {
      toast.error("Failed to delete video");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          className="bg-white/80 hover:bg-white text-black p-2 rounded-full shadow transition cursor-pointer"
          title="Edit"
          onClick={() => setShowEditor(true)}
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow transition cursor-pointer"
          title="Delete"
          onClick={handleDelete}
          disabled={deleting}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {showEditor && (
        <VideoEditor
          videoId={video._id}
          onClose={() => setShowEditor(false)}
          onUpdated={onUpdated}
        />
      )}
    </>
  );
};

export default VideoManager;
