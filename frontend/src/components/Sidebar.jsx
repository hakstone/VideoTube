import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  FilmIcon,
  UserGroupIcon,
  RectangleStackIcon,
  UserCircleIcon,
  ClockIcon,
  ChatBubbleBottomCenterTextIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const NavItem = ({ to, icon: Icon, label, end = false }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 mx-3 rounded-xl font-medium transition-all duration-300 group relative
        ${
          isActive
            ? "bg-rose-600 text-white shadow-lg shadow-rose-600/25"
            : "text-gray-300 hover:text-white hover:bg-gray-800"
        }`
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {(!isCollapsed || isMobileMenuOpen) && (
        <span className="truncate">{label}</span>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && !isMobileMenuOpen && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-gray-700">
          {label}
        </div>
      )}
    </NavLink>
  );

  const SectionDivider = ({ title }) => (
    <>
      {(!isCollapsed || isMobileMenuOpen) && (
        <div className="mx-3 my-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {title}
          </div>
        </div>
      )}
      {isCollapsed && !isMobileMenuOpen && (
        <div className="mx-3 my-4">
          <div className="h-px bg-gray-700"></div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-9 left-1 z-50 md:hidden 
             flex items-center justify-center 
             h-7 w-7 
             bg-gray-900 rounded-xl border border-gray-800 
             text-white hover:bg-gray-800 
             transition-all duration-200 shadow-lg backdrop-blur-sm"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="w-4 h-4" />
        ) : (
          <Bars3Icon className="w-4 h-4" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-auto h-screen bg-gray-950/95 backdrop-blur-xl border-r border-gray-800/50 transition-all duration-300 ease-out flex flex-col
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
        ${isCollapsed ? "w-20" : "w-72"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-8 px-6">
          {!isCollapsed || isMobileMenuOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold text-white">VideoTube</span>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="space-y-2">
            {links.map((link) => (
              <NavItem
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                end={link.to === "/"}
              />
            ))}
          </div>

          {/* User Section */}
          {user && (
            <>
              <SectionDivider title="Personal" />
              <div className="space-y-2">
                <NavItem to="/dashboard" icon={FilmIcon} label="Dashboard" />
                <NavItem
                  to={`/channel/${user.username}`}
                  icon={UserCircleIcon}
                  label="My Channel"
                />
                <NavItem
                  to={`/subscriptions/c/${user._id}`}
                  icon={UserGroupIcon}
                  label="Subscriptions"
                />
                <NavItem
                  to="/watch-history"
                  icon={ClockIcon}
                  label="Watch History"
                />
              </div>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800/50">
          {!isCollapsed || isMobileMenuOpen ? (
            <div className="text-center">
              <p className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()}{" "}
                <span className="text-rose-400 font-medium">VideoTube</span>
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block absolute -right-0 top-2 w-8 h-8 bg-gray-900 border-2 border-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 hover:border-gray-700 transition-all duration-200 shadow-lg z-10"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-4 h-4 mx-auto" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4 mx-auto" />
          )}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
