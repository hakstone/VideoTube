import React, { useState } from "react";
import API from "../api/api";
import { useAuth } from "../store/auth";

const SubscriptionButton = ({ channelId, isSubscribed: initial, onToggle }) => {
  const { user } = useAuth();
  const [subscribed, setSubscribed] = useState(initial);

  if (!user || user._id === channelId) return null;

  const toggle = async () => {
    await API.post(`/subscriptions/c/${channelId}`);
    setSubscribed((s) => !s);
    if (onToggle) onToggle(!subscribed);
  };

  return (
    <button
      onClick={toggle}
      className={`px-4 py-2 rounded font-semibold transition cursor-pointer 
        ${
          subscribed
            ? "bg-gray-800 border border-rose-600 text-rose-600"
            : "bg-rose-600 text-white"
        }
      `}
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
};

export default SubscriptionButton;
