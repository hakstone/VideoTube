import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { formatDistanceToNow } from "date-fns";
import LikeButton from "./LikeButton";

const TweetCard = ({ tweet, onLike, onDelete }) => {
  const { user } = useAuth();
  return (
    <div className="bg-gray-800 rounded-lg p-3 md:p-4 lg:p-5 mb-3 md:mb-4 flex flex-col gap-2 md:gap-3 border border-gray-900 hover:border-gray-700 transition-colors">
      <div className="flex items-start gap-2 md:gap-3">
        <Link
          to={`/channel/${tweet.owner?.username}`}
          className="flex-shrink-0"
        >
          <img
            src={tweet.owner?.avatar}
            alt="avatar"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-900"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <Link
              to={`/channel/${tweet.owner?.username}`}
              className="font-medium text-fuchsia-500 hover:text-fuchsia-400 text-sm md:text-base truncate"
            >
              {tweet.owner?.username}
            </Link>
            <span className="text-xs md:text-sm text-gray-400 flex-shrink-0">
              {formatDistanceToNow(new Date(tweet.createdAt))} ago
            </span>
          </div>

          <div className="text-sm md:text-base lg:text-lg text-teal-500 mt-1 md:mt-2 break-words">
            {tweet.content}
          </div>
        </div>

        {user?._id === tweet.owner?._id && onDelete && (
          <button
            onClick={onDelete}
            className="ml-auto px-2 py-1 text-xs md:text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
          >
            Delete
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mt-1 md:mt-2 ml-10 md:ml-12">
        {onLike && (
          <LikeButton
            liked={tweet.isLiked}
            onClick={onLike}
            count={tweet.likes}
          />
        )}
      </div>
    </div>
  );
};

export default TweetCard;
