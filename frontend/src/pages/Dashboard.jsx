import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../store/auth";
import VideoCard from "../components/VideoCard";
import AvatarUploader from "../components/AvatarUploader";
import { Link } from "react-router-dom";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import VideoManager from "../components/VideoManager";

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchStats = async () => {
    const res = await API.get("/dashboard/stats");
    setStats(res.data.data);
  };

  const fetchVideos = async () => {
    const res = await API.get("/dashboard/videos");
    setVideos(res.data.data);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const res = await API.patch("/users/update-account", editForm);
      setUser(res.data.data); // Update user in auth context
      setShowEditProfile(false);
      // You might want to show a success message here
    } catch (error) {
      console.error("Failed to update profile:", error);
      // You might want to show an error message here
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchStats();
    fetchVideos();
  }, []);

  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (!user)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">
            Please login to access your dashboard.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
          <div className="flex-shrink-0">
            <AvatarUploader avatarUrl={user.avatar} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {user.fullName}
            </h1>
            <p className="text-gray-400 text-base sm:text-lg mb-1">
              @{user.username}
            </p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <div className="w-full sm:w-auto">
            <button
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors"
              onClick={() => setShowEditProfile((s) => !s)}
            >
              {showEditProfile ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Edit Profile Form */}
        {showEditProfile && (
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-400 hover:text-red-300 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                {stats.videoCount}
              </div>
              <div className="text-gray-400 text-sm sm:text-base">Videos</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                {stats.subscriberCount}
              </div>
              <div className="text-gray-400 text-sm sm:text-base">
                Subscribers
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 text-center col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                {stats.totalViews}
              </div>
              <div className="text-gray-400 text-sm sm:text-base">
                Total Views
              </div>
            </div>
          </div>
        )}

        {/* Videos Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              My Videos
            </h2>
            <Link
              to="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" /> Upload New
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {videos.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg mb-4">
                  No videos uploaded yet.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" /> Upload Your First Video
                </Link>
              </div>
            ) : (
              videos.map((video) => (
                <div key={video._id} className="relative group">
                  <VideoCard video={video} />
                  <VideoManager video={video} onUpdated={fetchVideos} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
