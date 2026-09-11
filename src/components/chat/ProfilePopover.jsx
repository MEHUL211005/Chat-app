import React from "react";

export const ProfilePopover = ({ user, onLogout }) => {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
      {/* User Info */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-2 pb-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 text-sm font-semibold text-indigo-700">
          {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* Details */}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {user?.displayName || "User"}
          </p>

          <p className="truncate text-xs text-slate-500">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        className="mt-2 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePopover;