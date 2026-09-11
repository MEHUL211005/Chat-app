import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";

import ProfilePopover from "./ProfilePopover";
import LogoutModal from "./LogoutModal";

export const ChatHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogoutClick = () => {
    setShowProfile(false);
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);

      await logoutUser();

      toast.success("Logged out successfully");

      setShowLogoutModal(false);

      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);

      toast.error("Unable to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm sm:px-6">
        {/* App Name */}
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
            TalkSpace
          </h1>

          <p className="hidden text-xs text-slate-500 sm:block">
            Connect and chat with people
          </p>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfile((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 transition hover:bg-slate-50 sm:px-3"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 text-sm font-semibold text-indigo-700">
              {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <span className="hidden max-w-32 truncate text-sm font-medium text-slate-700 sm:block">
              {user?.displayName || "User"}
            </span>
          </button>

          {showProfile && (
            <ProfilePopover
              user={user}
              onLogout={handleLogoutClick}
            />
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          loading={loading}
        />
      )}
    </>
  );
};

export default ChatHeader;