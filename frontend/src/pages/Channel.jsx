import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import VideoCard from "../components/VideoCard";
import PlaylistCard from "../components/PlaylistCard";
import SubscriptionButton from "../components/SubscriptionButton";
import { useAuth } from "../store/auth";

const Channel = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [videos, setVideos] = useState([]);

  const fetchChannel = async () => {
    const res = await API.get(`/users/c/${username}`);
    setChannel(res.data.data);

    // userId for playlists and videos
    const uid = res.data.data._id;
    const playRes = await API.get(`/playlist/user/${uid}`);
    setPlaylists(playRes.data.data);

    setVideos(res.data.data.videos || []);
  };

  useEffect(() => {
    fetchChannel();
    // eslint-disable-next-line
  }, [username]);

  if (!channel)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-gray-400">Loading...</div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cover Image */}
        <div
          className="rounded-lg overflow-hidden mb-6 h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64"
          style={{
            background: channel.coverImage
              ? `url(${channel.coverImage}) center/cover`
              : "linear-gradient(135deg, #1f2937, #374151)",
          }}
        />

        {/* Channel Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
          <img
            src={channel.avatar}
            alt="avatar"
            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-4 border-rose-600 object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              {channel.fullName}
            </h1>
            <p className="text-gray-400 text-base sm:text-lg mb-1">
              @{channel.username}
            </p>
            <p className="text-sm sm:text-base text-gray-400">
              {channel.subscribersCount} subscribers
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <SubscriptionButton
              channelId={channel._id}
              isSubscribed={channel.isSubscribed}
            />
          </div>
        </div>

        {/* Playlists Section */}
        <div className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Playlists
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {playlists.length === 0 ? (
              <div className="col-span-full text-gray-400 text-center py-8">
                No playlists found.
              </div>
            ) : (
              playlists.map((p) => <PlaylistCard key={p._id} playlist={p} />)
            )}
          </div>
        </div>

        {/* Videos Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Videos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {videos.length === 0 ? (
              <div className="col-span-full text-gray-400 text-center py-8">
                No videos uploaded yet.
              </div>
            ) : (
              videos.map((v) => <VideoCard key={v._id} video={v} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channel;
