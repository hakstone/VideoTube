import React, { useEffect, useState } from "react";
import API from "../api/api";
import PlaylistCard from "../components/PlaylistCard";
import { useAuth } from "../store/auth";
import { PlusIcon } from "@heroicons/react/24/outline";
import ConfirmationModal from "../components/ConfirmationModal";

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchPlaylists = async () => {
    if (!user) return;
    setLoading(true);
    const res = await API.get(`/playlist/user/${user._id}`);
    setPlaylists(res.data.data);
    setLoading(false);
  };

  const handleDelete = (playlistId) => {
    setPendingDelete(playlistId);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    await API.delete(`/playlist/${pendingDelete}`);
    setPendingDelete(null);
    setModalOpen(false);
    fetchPlaylists();
  };

  useEffect(() => {
    fetchPlaylists();
    // eslint-disable-next-line
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) return;
    await API.post("/playlist", form);
    setForm({ name: "", description: "" });
    setShowCreate(false);
    fetchPlaylists();
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="text-white text-lg sm:text-xl">
            Please login to see your playlists.
          </div>
        </div>
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold">
          My Playlists
        </h1>
        <button
          onClick={() => setShowCreate((s) => !s)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors duration-200 text-sm sm:text-base"
        >
          <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" /> New Playlist
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <form
          className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6 border border-gray-900"
          onSubmit={handleCreate}
        >
          <div className="flex flex-col gap-4">
            <input
              className="bg-gray-900 rounded p-2 sm:p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-600 text-sm sm:text-base"
              placeholder="Playlist Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <textarea
              className="bg-gray-900 rounded p-2 sm:p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none text-sm sm:text-base"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              required
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                type="submit"
                className="bg-rose-600 text-white rounded px-4 py-2 font-semibold hover:bg-rose-700 transition-colors duration-200 text-sm sm:text-base"
              >
                Create
              </button>
              <button
                type="button"
                className="rounded px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors duration-200 text-sm sm:text-base"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-base sm:text-lg">
              Loading playlists...
            </div>
          </div>
        ) : playlists.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-base sm:text-lg">
              No playlists found.
            </div>
          </div>
        ) : (
          playlists.map((p) => (
            <div key={p._id} className="relative group">
              <PlaylistCard playlist={p} />
              {user?._id === (p.owner?._id || p.owner) && (
                <button
                  onClick={() => handleDelete(p._id)}
                  className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-xs text-white rounded hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
      <ConfirmationModal
        open={modalOpen}
        title="Delete Playlist"
        message="Are you sure you want to delete this playlist?"
        onConfirm={confirmDelete}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Playlists;
