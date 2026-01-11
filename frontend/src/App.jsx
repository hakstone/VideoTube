import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import useAuthSync from "./hooks/useAuth";
import { useAuth } from "./store/auth";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VideoDetails = lazy(() => import("./pages/VideoDetails"));
const Channel = lazy(() => import("./pages/Channel"));
const Subscriptions = lazy(() => import("./pages/Subscriptions"));
const Playlist = lazy(() => import("./pages/Playlist"));
const Playlists = lazy(() => import("./pages/Playlists"));
const Tweets = lazy(() => import("./pages/Tweets"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const WatchHistory = lazy(() => import("./pages/WatchHistory"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  useAuthSync();
  const { user } = useAuth();

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 p-2 sm:p-4 bg-gray-950">
          <Suspense
            fallback={<div className="text-center mt-12">Loading...</div>}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/video/:videoId" element={<VideoDetails />} />
              <Route path="/channel/:username" element={<Channel />} />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Login />}
              />
              <Route path="/subscriptions/c/:userId" element={<Subscriptions />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/playlist/:playlistId" element={<Playlist />} />
              <Route path="/tweets" element={<Tweets />} />
              <Route
                path="/watch-history"
                element={user ? <WatchHistory /> : <Login />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
