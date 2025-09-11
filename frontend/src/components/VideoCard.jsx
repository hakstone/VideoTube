import React from "react";
import { Link } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/24/outline";
import AddToPlaylistButton from "./AddToPlaylistButton";

const VideoCard = ({ video }) => {
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
        </div>

        {/* Video Info */}
        <div className="p-3 md:p-4">
          <h3 className="text-white font-semibold line-clamp-2 mb-2 group-hover:text-rose-300 transition-colors text-sm md:text-base lg:text-lg">
            {video.title}
          </h3>

          <p className="text-xs md:text-sm text-gray-400 line-clamp-2 mb-3 min-h-[2rem] md:min-h-[2.5rem]">
            {video.description}
          </p>

          {/* Owner Info */}
          {video.owner && (
            <div className="flex items-center gap-2 mb-3">
              <img
                src={video.owner.avatar}
                alt={video.owner.username}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-sm text-gray-300 font-medium">
                {video.owner.username}
              </span>
            </div>
          )}

          {/* Views & Date */}
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

      {/* Only Add to Playlist Button */}
      <div className="px-3 md:px-4 pb-3 md:pb-4">
        <AddToPlaylistButton videoId={video._id} />
      </div>
    </div>
  );
};

export default VideoCard;
