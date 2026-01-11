import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../store/auth";
import API from "../api/api";
import TweetCard from "../components/TweetCard";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Confirmation Dialog Component
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default",
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return {
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          confirmBtn: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        };
      default:
        return {
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          confirmBtn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        };
    }
  };

  const styles = getTypeStyles();

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-out scale-100 opacity-100">
        <div className="p-6 sm:p-8">
          <div
            className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full ${styles.iconBg} mb-4`}
          >
            <ExclamationTriangleIcon
              className={`w-6 h-6 ${styles.iconColor}`}
            />
          </div>

          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">{message}</p>
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-3">
            <button
              onClick={onConfirm}
              className={`w-full sm:w-auto px-4 py-2.5 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmBtn}`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Tweets = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    tweet: null,
  });

  const fetchTweets = async () => {
    setLoading(true);
    if (!user) {
      setTweets([]);
      setLoading(false);
      return;
    }
    const res = await API.get(`/tweets/user/${user._id}`);
    setTweets(res.data.data.tweets);
    setLoading(false);
  };

  useEffect(() => {
    fetchTweets();
    // eslint-disable-next-line
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await API.post("/tweets", { content });
    setContent("");
    fetchTweets();
  };

  const showDeleteConfirmation = (tweet) => {
    setConfirmDialog({ isOpen: true, tweet });
  };

  const handleDeleteConfirm = async () => {
    if (confirmDialog.tweet) {
      await API.delete(`/tweets/${confirmDialog.tweet._id}`);
      fetchTweets();
    }
    setConfirmDialog({ isOpen: false, tweet: null });
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({ isOpen: false, tweet: null });
  };

  const handleLike = async (tweet) => {
    await API.post(`/likes/toogle/t/${tweet._id}`);
    fetchTweets();
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="text-white text-lg sm:text-xl">
            Please login to see your tweets.
          </div>
        </div>
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-6">
        My Tweets
      </h1>

      {/* Tweet Creation Form */}
      <form
        className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6 border border-gray-900"
        onSubmit={handleCreate}
      >
        <div className="flex flex-col gap-3">
          <textarea
            className="bg-gray-900 rounded p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none w-full text-sm sm:text-base"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
            rows={3}
            required
          />

          {/* Character count and submit */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-400">
              {280 - content.length} characters remaining
            </div>
            <button
              type="submit"
              className="bg-rose-600 text-white rounded px-4 py-2 font-semibold hover:bg-rose-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={loading || !content.trim()}
            >
              {loading ? "Posting..." : "Tweet"}
            </button>
          </div>
        </div>
      </form>

      {/* Tweets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-base sm:text-lg">
              Loading tweets...
            </div>
          </div>
        ) : tweets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-base sm:text-lg">
              No tweets yet. Share your first thought!
            </div>
          </div>
        ) : (
          tweets.map((tweet) => (
            <div key={tweet._id} className="w-full">
              <TweetCard
                tweet={tweet}
                onLike={() => handleLike(tweet)}
                onDelete={() => showDeleteConfirmation(tweet)}
              />
            </div>
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        type="warning"
        title="Delete Tweet"
        message="Delete this tweet? This action cannot be undone and the tweet will be permanently removed."
        confirmText="Delete Tweet"
        cancelText="Keep Tweet"
      />
    </div>
  );
};

export default Tweets;
