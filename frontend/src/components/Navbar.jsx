import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import API from "../api/api";

const Navbar = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/users/logout");
    } catch {}
    logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-3 md:px-4 lg:px-6 py-2 md:py-3 border-b border-gray-900 bg-gray-900 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="text-lg md:text-xl lg:text-2xl font-bold text-rose-600 tracking-wider"
        >
          VideoTube
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-2 py-1 md:px-3 md:py-2 rounded bg-rose-600 hover:bg-pink-700 text-white font-medium transition text-sm md:text-base"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-2 py-1 md:px-3 md:py-2 rounded border border-gray-700 text-white hover:bg-gray-800 transition text-sm md:text-base hidden sm:block"
            >
              Register
            </Link>
            <Link
              to="/register"
              className="px-2 py-1 rounded border border-gray-700 text-white hover:bg-gray-800 transition text-sm sm:hidden"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to={`/channel/${user.username}`}
              className="flex items-center gap-1 md:gap-2 px-1 py-1 md:px-2 md:py-1 text-white rounded hover:bg-gray-800 transition"
            >
              <img
                src={user.avatar}
                alt="avatar"
                className="rounded-full w-6 h-6 md:w-8 md:h-8 object-cover border border-gray-900"
              />
              <span className="font-semibold text-sm md:text-base hidden sm:block truncate max-w-20 md:max-w-32">
                {user.username}
              </span>
            </Link>

            <Link
              to="/dashboard"
              className="p-1.5 md:p-2 rounded hover:bg-gray-800 transition"
              title="Dashboard"
            >
              <Cog6ToothIcon className="w-5 h-5 md:w-6 md:h-6 text-rose-600" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 md:p-2 rounded hover:bg-gray-800 transition"
              title="Logout"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 md:w-6 md:h-6 text-rose-600" />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
