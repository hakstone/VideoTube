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
      <div className="text-center mt-10">
        <div className="text-white">
          Please login to see your subscriptions.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-10">
        <div className="text-gray-400">Loading subscriptions...</div>
      </div>
    );
  }

  if (subscribedChannels.length === 0) {
    return (
      <div className="text-center mt-10">
        <div className="text-gray-400">
          You are not subscribed to any channels yet.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl text-white font-bold mb-6">
        Subscribed Channels
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscribedChannels.map(({ channel }) => (
          <Link
            key={channel._id}
            to={`/channel/${channel.username}`}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-900"
          >
            <div className="flex items-center gap-4">
              <img
                src={channel.avatar || "/default-avatar.png"}
                alt={channel.fullName}
                className="w-12 h-12 rounded-full object-cover border-2 border-rose-600"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div>
                <h3 className="font-semibold text-white text-lg">
                  {channel.fullName}
                </h3>
                <p className="text-sm text-gray-400">@{channel.username}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
