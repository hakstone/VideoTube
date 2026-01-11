import React, { useState, useEffect } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ReactDOM from "react-dom";
import API from "../api/api";
import { useAuth } from "../store/auth";

// Modal component rendered via portal
function AddToPlaylistModal({ show, onClose, playlists, addingTo, handleAdd }) {
  if (!show) return null;
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md md:max-w-lg border border-black relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-black">
          <h2 className="text-base md:text-lg font-semibold text-white">
            Add to Playlist
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-fuchsia-400 transition-colors"
            tabIndex={0}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 flex-1 overflow-hidden">
          {playlists.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">No playlists found</div>
              <div className="text-sm text-gray-500">
                Create a playlist first to add videos
              </div>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3 max-h-60 md:max-h-80 overflow-y-auto">
              {playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => handleAdd(playlist._id)}
                  disabled={addingTo === playlist._id}
                  className="w-full text-left p-3 md:p-4 rounded-lg bg-blue-950 hover:bg-blue-900 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm md:text-base truncate">
                        {playlist.name}
                      </div>
                      {playlist.description && (
                        <div className="text-xs md:text-sm text-gray-400 truncate mt-1">
                          {playlist.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {playlist.totalVideos || 0} videos
                      </div>
                    </div>
                    {addingTo === playlist._id && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-vt-accent border-t-transparent ml-2 flex-shrink-0"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body // Portal target
  );
}

const AddToPlaylistButton = ({ videoId, onAdded }) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [show, setShow] = useState(false);
  const [addingTo, setAddingTo] = useState(null);

  useEffect(() => {
    if (show && user) {
      fetchPlaylists();
    }
    // eslint-disable-next-line
  }, [show, user]);

  const fetchPlaylists = async () => {
    try {
      const res = await API.get(`/playlist/user/${user._id}`);
      setPlaylists(res.data.data || []);
    } catch {
      setPlaylists([]);
    }
  };

  const handleAdd = async (playlistId) => {
    setAddingTo(playlistId);
    try {
      await API.patch(`/playlist/add/${videoId}/${playlistId}`);
      setShow(false);
      if (onAdded) onAdded();
    } catch {}
    setAddingTo(null);
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShow(true);
        }}
        className="flex items-center gap-1 md:gap-2 bg-blue-950 hover:bg-blue-900 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-md transition shadow font-medium cursor-pointer text-xs md:text-sm"
        title="Add to playlist"
        type="button"
      >
        <PlusIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
        <span className="hidden sm:inline">Add to Playlist</span>
        <span className="sm:hidden">Add</span>
      </button>
      <AddToPlaylistModal
        show={show}
        onClose={() => setShow(false)}
        playlists={playlists}
        addingTo={addingTo}
        handleAdd={handleAdd}
      />
    </>
  );
};

export default AddToPlaylistButton;
