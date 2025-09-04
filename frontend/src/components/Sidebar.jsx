import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  FilmIcon,
  UserGroupIcon,
  RectangleStackIcon,
  InboxStackIcon,
  UserCircleIcon,
  ClockIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../store/auth";

const links = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/playlists", label: "Playlists", icon: RectangleStackIcon },
  { to: "/tweets", label: "Tweets", icon: ChatBubbleBottomCenterTextIcon },
];

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-52 bg-gray-950 border-r border-gray-900 h-screen sticky top-0 py-4">
      <div className="flex flex-col gap-2 flex-1">
        {links.map((link) => (
          <NavLink
            to={link.to}
            key={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2 rounded text-white font-medium transition 
              ${
                isActive || location.pathname === link.to
                  ? "bg-gray-800 text-rose-600"
                  : "hover:bg-gray-800"
              }`
            }
            end
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}

        {user && (
          <>
            <div className="mt-6 mb-2 px-5 text-xs text-rose-600 uppercase tracking-wider">
              My Stuff
            </div>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2 rounded transition font-medium text-white
                ${isActive ? "bg-gray-800 text-rose-600" : "hover:bg-gray-800"}`
              }
            >
              <FilmIcon className="w-5 h-5" />
              Dashboard
            </NavLink>
            <NavLink
              to={`/channel/${user.username}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2 rounded transition font-medium text-white
                ${isActive ? "bg-gray-800 text-rose-600" : "hover:bg-gray-800"}`
              }
            >
              <UserCircleIcon className="w-5 h-5" />
              My Channel
            </NavLink>
            <NavLink
              to={`/subscriptions/c/${user._id}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2 rounded transition font-medium text-white
                ${isActive ? "bg-gray-800 text-rose-600" : "hover:bg-gray-800"}`
              }
            >
              <UserGroupIcon className="w-5 h-5" />
              Subscriptions
            </NavLink>
            <NavLink
              to="/watch-history"
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2 rounded transition font-medium text-white
                ${isActive ? "bg-gray-800 text-rose-600" : "hover:bg-gray-800"}`
              }
            >
              <ClockIcon className="w-5 h-5" />
              Watch History
            </NavLink>
          </>
        )}
      </div>
      <div className="px-5 py-2 text-xs text-pink-300">
        <span className="text-rose-500 font-semibold">VideoTube</span> &copy;{" "}
        {new Date().getFullYear()}
      </div>
    </aside>
  );
};

export default Sidebar;
