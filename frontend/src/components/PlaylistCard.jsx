import React from "react";
import { Link } from "react-router-dom";
import { RectangleStackIcon } from "@heroicons/react/24/outline";

const PlaylistCard = ({ playlist }) => (
  <div>
    <Link
      to={`/playlist/${playlist._id}`}
      className="bg-gray-800 rounded-lg border border-gray-900 p-3 flex flex-col gap-2 hover:scale-[1.03] transition"
    >
      <div className="flex items-center gap-2">
        <RectangleStackIcon className="w-7 h-7 text-rose-600" />
        <span className="font-semibold text-amber-200 text-lg">
          {playlist.name}
        </span>
      </div>
      <div className="text-sm text-gray-300 line-clamp-2">
        {playlist.description}
      </div>
      <div className="flex items-center text-xs text-gray-400 gap-2">
        {playlist.totalVideos || playlist.videos?.length || 0} Videos
        <span>&#183;</span>
        {playlist.totalViews || 0} Views
      </div>
    </Link>
  </div>
);

export default PlaylistCard;
