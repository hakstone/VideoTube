import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../store/auth";

const Playlist = () => {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);

  const fetchPlaylist = async () => {
    const res = await API.get(`/playlist/${playlistId}`);
    setPlaylist(res.data.data);
  };

  const handleRemove = async (videoId) => {
    await API.patch(`/playlist/remove/${videoId}/${playlist._id}`);
    fetchPlaylist();
  };

  useEffect(() => {
    fetchPlaylist();
    // eslint-disable-next-line
  }, [playlistId]);

  if (!playlist)
    return (
      <div className="text-center mt-10 px-4">
        <div className="text-white text-lg sm:text-xl">Loading playlist...</div>
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      {/* Playlist Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-2">
            {playlist.name}
          </h1>
          <div className="text-gray-400 text-sm sm:text-base">
            {playlist.totalVideos} videos
          </div>
        </div>
      </div>

      {/* Description */}
      {playlist.description && (
        <div className="mb-6 text-gray-300 text-sm sm:text-base leading-relaxed">
          {playlist.description}
        </div>
      )}

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {playlist.videos?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-base sm:text-lg">
              No videos in this playlist.
            </div>
          </div>
        ) : (
          playlist.videos?.map((v) => (
            <div key={v._id} className="relative group">
              <VideoCard video={v} />
              {user?._id === playlist.owner?._id && (
                <button
                  onClick={() => handleRemove(v._id)}
                  className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-xs text-white opacity-0 group-hover:opacity-100 hover:bg-red-700 rounded transition-all duration-200 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlist;
