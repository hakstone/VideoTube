import React, { useEffect, useState } from "react";
import API from "../api/api";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../store/auth";
import { TrashIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const WatchHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    const res = await API.get("/users/watch-history");
    setHistory(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

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

  const handleRemove = async (videoId) => {
    try {
      await API.delete(`/users/watch-history/${videoId}`);
      toast.success("Removed from Watch History");
      setHistory((prev) => prev.filter((v) => v._id !== videoId));
      setActiveMenu(null);
    } catch (error) {
      console.error("Error removing from history:", error);
      toast.error("Failed to remove from history");
    }
  };

  const toggleMenu = (videoId) => {
    setActiveMenu(activeMenu === videoId ? null : videoId);
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="text-white text-lg sm:text-xl">
            Please login to see your watch history.
          </div>
        </div>
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold">
          Watch History
        </h1>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-base sm:text-lg">
              Loading watch history...
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-base sm:text-lg mb-4">
              No watch history found.
            </div>
            <div className="text-gray-500 text-sm sm:text-base">
              Videos you watch will appear here.
            </div>
          </div>
        ) : (
          history.map((video) => (
            <div key={video._id} className="relative group">
              <VideoCard video={video} showActions={false} />

              {/* Three Dots Menu Button */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(video._id);
                  }}
                  className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transition-all duration-200 group-hover:opacity-100 sm:opacity-100 opacity-100"
                >
                  <EllipsisVerticalIcon className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {activeMenu === video._id && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => handleRemove(video._id)}
                        className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-3 text-sm transition-colors duration-200"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Remove from history
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Watch Date Overlay - Only show on hover for larger screens */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity duration-200">
                Watched{" "}
                {new Date(
                  video.watchedAt || video.createdAt
                ).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Text */}
      {history.length > 0 && (
        <div className="mt-8 text-center text-gray-500 text-xs sm:text-sm">
          <p>Your watch history helps us recommend videos you might like.</p>
          <p className="mt-1">
            Use the menu button on videos to remove them from your history.
          </p>
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
