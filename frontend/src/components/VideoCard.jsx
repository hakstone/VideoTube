// // import React from "react";
// // import { Link } from "react-router-dom";
// // import { EyeIcon } from "@heroicons/react/24/outline";
// // import AddToPlaylistButton from "./AddToPlaylistButton";

// // const VideoCard = ({ video }) => {
// //   return (
// //     <div className="bg-gray-800 rounded-lg overflow-hidden shadow hover:scale-[1.025] transition relative">
// //       <Link to={`/video/${video._id}`} className="block">
// //         <div className="aspect-video relative bg-gray-900">
// //           <img
// //             src={video.thumbnail}
// //             alt={video.title}
// //             className="object-cover w-full h-full"
// //           />
// //           <span className="absolute bottom-2 right-2 bg-black/70 text-xs px-2 py-1 rounded text-white font-semibold">
// //             {video.duration ? video.duration : "--:--"}
// //           </span>
// //         </div>
// //         <div className="p-3 flex flex-col gap-1">
// //           <span className="text-white font-bold">{video.title}</span>
// //           <span className="text-sm text-gray-400 line-clamp-2">
// //             {video.description}
// //           </span>
// //           <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
// //             <EyeIcon className="w-4 h-4" />
// //             {video.views} views
// //             <span className="ml-auto">
// //               {new Date(video.createdAt).toLocaleDateString()}
// //             </span>
// //           </div>
// //         </div>
// //       </Link>

// //       <div className="absolute top-2 right-2">
// //         <AddToPlaylistButton videoId={video._id} />
// //       </div>
// //     </div>
// //   );
// // };

// // export default VideoCard;

// // import React from "react";
// // import { Link } from "react-router-dom";
// // import { EyeIcon } from "@heroicons/react/24/outline";
// // import AddToPlaylistButton from "./AddToPlaylistButton";

// // const VideoCard = ({ video }) => {
// //   return (
// //     <div className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative">
// //       {/* Video Thumbnail and Link */}
// //       <Link to={`/video/${video._id}`} className="block">
// //         <div className="aspect-video relative bg-gray-900 overflow-hidden">
// //           <img
// //             src={video.thumbnail}
// //             alt={video.title}
// //             className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
// //             loading="lazy"
// //           />

// //           {/* Duration Badge */}
// //           <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">
// //             {video.duration || "--:--"}
// //           </span>

// //           {/* Gradient overlay on hover */}
// //           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
// //         </div>

// //         {/* Video Info */}
// //         <div className="p-4">
// //           <h3 className="text-white font-semibold line-clamp-2 mb-2 group-hover:text-rose-300 transition-colors">
// //             {video.title}
// //           </h3>

// //           <p className="text-sm text-gray-400 line-clamp-2 mb-3">
// //             {video.description}
// //           </p>

// //           <div className="flex items-center justify-between text-xs text-gray-500">
// //             <div className="flex items-center gap-1">
// //               <EyeIcon className="w-3 h-3" />
// //               <span>{video.views || 0} views</span>
// //             </div>
// //             <span>{new Date(video.createdAt).toLocaleDateString()}</span>
// //           </div>
// //         </div>
// //       </Link>

// //       {/* Add to Playlist Button - Only visible on hover */}
// //       <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
// //         <AddToPlaylistButton videoId={video._id} />
// //       </div>
// //     </div>
// //   );
// // };

// // export default VideoCard;

// import React from "react";
// import { Link } from "react-router-dom";
// import { EyeIcon } from "@heroicons/react/24/outline";
// import AddToPlaylistButton from "./AddToPlaylistButton";

// const VideoCard = ({ video }) => {
//   return (
//     <div className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
//       {/* Video Thumbnail and Link */}
//       <Link to={`/video/${video._id}`} className="block">
//         <div className="aspect-video relative bg-gray-900 overflow-hidden">
//           <img
//             src={video.thumbnail}
//             alt={video.title}
//             className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
//             loading="lazy"
//           />

//           {/* Duration Badge */}
//           <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">
//             {video.duration || "--:--"}
//           </span>

//           {/* Gradient overlay on hover */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//         </div>

//         {/* Video Info */}
//         <div className="p-4">
//           <h3 className="text-white font-semibold line-clamp-2 mb-2 group-hover:text-rose-300 transition-colors">
//             {video.title}
//           </h3>

//           <p className="text-sm text-gray-400 line-clamp-2 mb-3">
//             {video.description}
//           </p>

//           <div className="flex items-center justify-between text-xs text-gray-500">
//             <div className="flex items-center gap-1">
//               <EyeIcon className="w-3 h-3" />
//               <span>{video.views || 0} views</span>
//             </div>
//             <span>{new Date(video.createdAt).toLocaleDateString()}</span>
//           </div>
//         </div>
//       </Link>

//       {/* Add to Playlist Button - Outside the video card content */}
//       <div className="px-4 pb-4">
//         <div className="flex justify-end">
//           <AddToPlaylistButton videoId={video._id} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCard;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
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

  const isOwner = user && user._id === video.owner?._id;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`Delete "${video.title}"? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await API.delete(`/videos/${video._id}`);
      toast.success("Video deleted successfully!");
      // You might want to trigger a refresh of the parent component
      if (window.location.reload) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    } finally {
      setIsDeleting(false);
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
      // Trigger refresh
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
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between gap-2">
        {/* Add to Playlist Button (for all users) */}
        <AddToPlaylistButton videoId={video._id} />

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              title="Edit video"
            >
              <PencilIcon className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePublish}
              className={`p-2 rounded-lg transition-colors ${
                video.isPublished
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              title={video.isPublished ? "Unpublish video" : "Publish video"}
            >
              {video.isPublished ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg transition-colors"
              title="Delete video"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

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

  return (
    <div className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
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
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">
            {formatDuration(video.duration)}
          </span>

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Video Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold line-clamp-2 mb-2 group-hover:text-rose-300 transition-colors">
            {video.title}
          </h3>

          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {video.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <EyeIcon className="w-3 h-3" />
              <span>{video.views || 0} views</span>
            </div>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>

      {/* Action Buttons - Outside the video card content */}
      {showActions && <VideoCardActions video={video} />}
    </div>
  );
};

export default VideoCard;
