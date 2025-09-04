import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../store/auth";

const Playlist = () => {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);

  const fetchPlaylist = async () => {
    const res = await API.get(`/playlist/${playlistId}`);
    setPlaylist(res.data.data);
  };

  const handleRemove = async (videoId) => {
    await API.patch(`/playlist/remove/${videoId}/${playlist._id}`);
    fetchPlaylist();
  };

  useEffect(() => {
    fetchPlaylist();
    // eslint-disable-next-line
  }, [playlistId]);

  if (!playlist)
    return <div className="text-center mt-10">Loading playlist...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-2xl text-white font-bold">{playlist.name}</h1>
        <div className="text-gray-400 text-sm">
          {playlist.totalVideos} videos
        </div>
      </div>
      <div className="mb-4 text-gray-300">{playlist.description}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {playlist.videos?.length === 0 ? (
          <div className="col-span-full text-gray-400">
            No videos in this playlist.
          </div>
        ) : (
          playlist.videos?.map((v) => (
            <div key={v._id} className="relative group">
              <VideoCard video={v} />
              {user?._id === playlist.owner?._id && (
                <button
                  onClick={() => handleRemove(v._id)}
                  className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-xs text-white opacity-0 group-hover:opacity-100 hover:bg-red-700 rounded cursor-pointer transition-opacity duration-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlist;
