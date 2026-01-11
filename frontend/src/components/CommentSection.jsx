import React, { useState, useEffect } from "react";
import API from "../api/api";
import { useAuth } from "../store/auth";
import LikeButton from "./LikeButton";
import ConfirmationModal from "./ConfirmationModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const Comment = ({ comment, onLike, onEdit, onDelete, user }) => (
  <div className="flex items-start gap-2 md:gap-3 py-3 border-b border-gray-900 last:border-none">
    <img
      src={comment.owner?.avatar}
      alt="avatar"
      className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-gray-900 flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="font-medium text-rose-600 text-sm md:text-base truncate">
          {comment.owner?.username}
        </span>
        <span className="text-xs text-gray-400 flex-shrink-0">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
        {user?._id === comment.owner?._id && (
          <div className="flex gap-1 ml-auto mt-1 sm:mt-0">
            <button
              title="Edit"
              className="p-1 hover:bg-gray-800 rounded"
              onClick={() => onEdit(comment)}
            >
              <PencilIcon className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
            </button>
            <button
              title="Delete"
              className="p-1 hover:bg-gray-800 rounded"
              onClick={() => onDelete(comment)}
            >
              <TrashIcon className="w-3 h-3 md:w-4 md:h-4 text-red-400" />
            </button>
          </div>
        )}
      </div>
      <div className="mt-1 md:mt-2 text-amber-100 text-sm md:text-base break-words">
        {comment.content}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <LikeButton
          liked={comment.isLiked}
          count={comment.likes || 0}
          onClick={() => onLike(comment)}
        />
      </div>
    </div>
  </div>
);

const CommentSection = ({ videoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal state management for deletion
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/comments/${videoId}`);
      setComments(res.data.data.comments || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) fetchComments();
    // eslint-disable-next-line
  }, [videoId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await API.post(`/comments/${videoId}`, { content });
    setContent("");
    fetchComments();
  };

  const handleEdit = (comment) => {
    setEditing(comment);
    setContent(comment.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await API.patch(`/comments/c/${editing._id}`, { content });
    setEditing(null);
    setContent("");
    fetchComments();
  };

  // Updated delete logic: show confirmation modal
  const handleDelete = (comment) => {
    setPendingDelete(comment);
    setModalOpen(true);
  };

  // Modal confirmed delete
  const confirmDelete = async () => {
    if (pendingDelete) {
      await API.delete(`/comments/c/${pendingDelete._id}`);
      setModalOpen(false);
      setPendingDelete(null);
      fetchComments();
    }
  };

  const handleLike = async (comment) => {
    await API.post(`/likes/toogle/c/${comment._id}`);
    fetchComments();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-3 md:p-4 lg:p-6 mt-4 md:mt-6">
      <h3 className="font-bold text-white mb-3 md:mb-4 text-base md:text-lg">
        Comments
      </h3>

      {user && (
        <form
          onSubmit={editing ? handleUpdate : handleAdd}
          className="flex flex-col sm:flex-row items-start gap-2 md:gap-3 mb-4 md:mb-6"
        >
          <img
            src={user.avatar}
            alt="avatar"
            className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-gray-900 flex-shrink-0"
          />
          <div className="flex-1 w-full sm:w-auto">
            <textarea
              className="w-full bg-gray-900 text-white rounded-lg p-2 md:p-3 resize-none h-16 md:h-20 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm md:text-base"
              placeholder="Leave a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={300}
            />
            <div className="text-xs text-gray-400 mt-1 text-right">
              {content.length}/300
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto sm:flex-col">
            <button
              type="submit"
              className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 px-3 py-2 md:px-4 md:py-2 rounded-lg text-white font-bold cursor-pointer text-sm md:text-base transition-colors"
            >
              {editing ? "Update" : "Post"}
            </button>
            {editing && (
              <button
                type="button"
                className="flex-1 sm:flex-none px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setEditing(null);
                  setContent("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="space-y-1">
        {loading ? (
          <div className="text-gray-400 text-center py-4">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-gray-400 text-center py-4">No comments yet.</div>
        ) : (
          comments.map((c) => (
            <Comment
              key={c._id}
              comment={c}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
              user={user}
            />
          ))
        )}
      </div>

      {/* Confirmation Modal for delete */}
      <ConfirmationModal
        open={modalOpen}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setModalOpen(false);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};

export default CommentSection;
