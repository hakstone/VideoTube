// import React, { useEffect, useState } from "react";
// import API from "../api/api";
// import VideoCard from "../components/VideoCard";
// import { useAuth } from "../store/auth";

// const WatchHistory = () => {
//   const { user } = useAuth();
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchHistory = async () => {
//     setLoading(true);
//     const res = await API.get("/users/watch-history");
//     setHistory(res.data.data);
//     setLoading(false);
//   };

//   console.log(history);

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   if (!user)
//     return (
//       <div className="text-center mt-10">
//         <div>Please login to see your watch history.</div>
//       </div>
//     );

//   return (
//     <div>
//       <h1 className="text-2xl text-white font-bold mb-3">Watch History</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {loading ? (
//           <div className="col-span-full text-gray-400">Loading...</div>
//         ) : history.length === 0 ? (
//           <div className="col-span-full text-gray-400">No watch history.</div>
//         ) : (
//           history.map((video) => <VideoCard key={video._id} video={video} />)
//         )}
//       </div>
//     </div>
//   );
// };

// export default WatchHistory;

import React, { useEffect, useState } from "react";
import API from "../api/api";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../store/auth";
import { TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const WatchHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    const res = await API.get("/users/watch-history");
    setHistory(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  const handleRemove = async (videoId) => {
    await API.delete(`/users/watch-history/${videoId}`);
    toast.success("Removed from Watch History");
    setHistory((prev) => prev.filter((v) => v._id !== videoId));
  };

  if (!user)
    return (
      <div className="text-center mt-10">
        <div>Please login to see your watch history.</div>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl text-white font-bold mb-3">Watch History</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-gray-400">Loading...</div>
        ) : history.length === 0 ? (
          <div className="col-span-full text-gray-400">No watch history.</div>
        ) : (
          history.map((video) => (
            <div key={video._id} className="relative group">
              <VideoCard video={video} showActions={false} />
              <button
                onClick={() => handleRemove(video._id)}
                className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                title="Remove from history"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
