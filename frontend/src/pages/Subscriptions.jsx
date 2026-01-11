import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom";
import API from "../api/api";

const Subscriptions = () => {
  const { user } = useAuth();
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSubscribedChannels = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/subscriptions/c/${user._id}`);
        setSubscribedChannels(res.data.data || []);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
        setSubscribedChannels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribedChannels();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="text-white text-lg sm:text-xl">
            Please login to see your subscriptions.
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="text-gray-400 text-lg sm:text-xl">
            Loading subscriptions...
          </div>
        </div>
      </div>
    );
  }

  if (subscribedChannels.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="text-gray-400 text-lg sm:text-xl">
            You are not subscribed to any channels yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-6">
        Subscribed Channels
      </h1>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {subscribedChannels.map(({ channel }) => (
          <Link
            key={channel._id}
            to={`/channel/${channel.username}`}
            className="bg-gray-800 rounded-lg p-4 sm:p-6 hover:bg-gray-700 transition-colors duration-200 border border-gray-900"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Avatar */}
              <img
                src={channel.avatar || "/default-avatar.png"}
                alt={channel.fullName}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-rose-600 flex-shrink-0"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />

              {/* Channel Info */}
              <div className="text-center sm:text-left min-w-0">
                <h3 className="font-semibold text-white text-base sm:text-lg truncate">
                  {channel.fullName}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  @{channel.username}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
