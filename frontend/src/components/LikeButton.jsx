import React from "react";
import { HandThumbUpIcon as SolidLike } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineLike } from "@heroicons/react/24/outline";

const LikeButton = ({ liked, onClick, count }) => (
  <button
    className={`flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-lg transition-all duration-200 text-xs md:text-sm
      ${
        liked
          ? "bg-rose-600 hover:bg-rose-700 text-white"
          : "bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    onClick={onClick}
    type="button"
  >
    {liked ? (
      <SolidLike className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
    ) : (
      <OutlineLike className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
    )}
    {typeof count === "number" && (
      <span className="font-medium">
        {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
      </span>
    )}
  </button>
);

export default LikeButton;
