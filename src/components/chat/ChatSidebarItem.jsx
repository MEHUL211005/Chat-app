import React from "react";

export const ChatSidebarItem = ({ chat, onClick, isActive }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition ${
        isActive
          ? "border-indigo-200 bg-indigo-50 shadow-sm"
          : "border-transparent bg-white hover:bg-slate-100"
      }`}
    >
      {/* Avatar */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 text-sm font-semibold text-indigo-700">
        {chat.name?.charAt(0)?.toUpperCase() || "?"}
      </div>

      {/* Chat Information */}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-800">
            {chat.name}
          </h3>

          <span className="shrink-0 text-[10px] text-slate-400">
            {chat.time}
          </span>
        </div>

        <p className="mt-1 truncate text-xs text-slate-500">
          {chat.lastMessage}
        </p>
      </div>
    </button>
  );
};

export default ChatSidebarItem;