import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../store/auth";
import { TrashIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const Playlist = () => {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchPlaylist = async () => {
    const res = await API.get(`/playlist/${playlistId}`);
    setPlaylist(res.data.data);
  };

  const handleRemove = async (videoId) => {
    await API.patch(`/playlist/remove/${videoId}/${playlist._id}`);
    setActiveMenu(null);
    fetchPlaylist();
  };

  const toggleMenu = (videoId) => {
    setActiveMenu(activeMenu === videoId ? null : videoId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };

    if (activeMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeMenu]);

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
              <VideoCard video={v} showActions={false} />
              {user?._id === playlist.owner?._id && (
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(v._id);
                    }}
                    className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200 group-hover:opacity-100 sm:opacity-100 opacity-100"
                  >
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenu === v._id && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleRemove(v._id)}
                          className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-3 text-sm transition-colors duration-200"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Remove from playlist
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlist;
