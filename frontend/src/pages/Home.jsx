import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import API from "../api/api";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import VideoUploader from "../components/VideoUploader";
import { useAuth } from "../store/auth";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        "/videos?sortBy=createdAt&sortType=desc&limit=24"
      );
      setVideos(res.data.data.videos);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Filtering videos based on search term
  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-800 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-800 rounded w-24 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-video bg-gray-800 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Latest Videos
          </h1>
          {user && (
            <button
              onClick={() => setShowUploader((s) => !s)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Upload</span>
            </button>
          )}
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search videos..."
            className="
      w-full sm:w-80
      px-4 py-3
      rounded-xl
      bg-gray-900/70
      backdrop-blur-md
      text-white text-lg
      placeholder-gray-400
      border border-transparent
      shadow-md
      focus:outline-none
      focus:ring-4 focus:ring-rose-500/70
      focus:border-rose-500
      transition
      duration-300
      hover:bg-gray-800/80
    "
          />
        </div>

        {/* Video Uploader */}
        {showUploader && (
          <div className="mb-8">
            <VideoUploader
              onUploaded={() => {
                setShowUploader(false);
                fetchVideos();
              }}
            />
          </div>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredVideos.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-300 mb-4">
                  No videos found
                </h2>
                <p className="text-gray-400 mb-6">
                  {user
                    ? "Be the first to upload a video and share it with the world!"
                    : "Try logging in first to see personalized content"}
                </p>
                {user ? (
                  <button
                    onClick={() => setShowUploader(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Upload First Video
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="inline-block px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors"
                  >
                    Login to Continue
                  </Link>
                )}
              </div>
            </div>
          ) : (
            filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))
          )}
        </div>

        {/* Load More Button (if needed) */}
        {filteredVideos.length > 0 && filteredVideos.length >= 24 && (
          <div className="text-center mt-12">
            <button
              onClick={fetchVideos}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Load More Videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
