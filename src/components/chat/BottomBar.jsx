import React from "react";

export const BottomBar = () => {
  return (
    <footer className="flex h-14 shrink-0 items-center justify-between border-t border-slate-200 bg-white/80 px-4 sm:px-6">
      {/* Left */}
      <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
        Chat App
      </p>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-slate-500 sm:block">
          Real-time messaging
        </span>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm" />

          <span className="text-xs text-slate-500">
            Online
          </span>
        </div>
      </div>
    </footer>
  );
};

export default BottomBar;