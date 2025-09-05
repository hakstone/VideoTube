import React, { useState } from "react";
import API from "../api/api";
import { useAuth } from "../store/auth";

const SubscriptionButton = ({ channelId, isSubscribed: initial, onToggle }) => {
  const { user } = useAuth();
  const [subscribed, setSubscribed] = useState(initial);
  const [loading, setLoading] = useState(false);

  if (!user || user._id === channelId) return null;

  const toggle = async () => {
    setLoading(true);
    try {
      await API.post(`/subscriptions/c/${channelId}`);
      setSubscribed((s) => !s);
      if (onToggle) onToggle(!subscribed);
    } catch (error) {
      console.error("Error toggling subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-3 py-1.5 md:px-4 md:py-2 lg:px-6 lg:py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm md:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${
          subscribed
            ? "bg-gray-800 border border-rose-600 text-rose-600 hover:bg-gray-700"
            : "bg-rose-600 text-white hover:bg-rose-700 shadow-lg hover:shadow-xl"
        }
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-2 border-current border-t-transparent"></div>
          <span className="hidden sm:inline">Processing...</span>
        </div>
      ) : (
        <>
          <span className="hidden sm:inline">
            {subscribed ? "Subscribed" : "Subscribe"}
          </span>
          <span className="sm:hidden">{subscribed ? "Sub'd" : "Sub"}</span>
        </>
      )}
    </button>
  );
};

export default SubscriptionButton;
