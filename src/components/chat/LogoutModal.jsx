import React from "react";

export const LogoutModal = ({ onCancel, onConfirm, loading }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/25 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.15)]">
        {/* Header */}
        <h2 className="text-lg font-semibold text-slate-900">
          Logout
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Are you sure you want to logout from your account?
        </p>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;