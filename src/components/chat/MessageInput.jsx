import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { sendMessage } from "../../services/chatService";

export const MessageInput = ({
  chatId,
  disabled = false,
  value = "",
  onChange,
  onClear,
}) => {
  const { user } = useAuth();
  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!disabled && !loading) {
      inputRef.current?.focus();
    }
  }, [disabled, loading, chatId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = value.trim();

    if (!trimmedMessage || !chatId || !user?.uid || loading) {
      return;
    }

    try {
      setLoading(true);

      await sendMessage(
        chatId,
        user.uid,
        trimmedMessage,
      );

      onClear?.();
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } catch (error) {
      console.error(error);

      toast.error("Unable to send message.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    disabled || loading || !value.trim();

  return (
    <div className="shrink-0 border-t border-slate-200 bg-white/90 p-3 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-4xl items-end gap-2"
      >
        <div className="min-w-0 flex-1">
          <input
            type="text"
            ref={inputRef}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled || loading}
            placeholder={
              disabled
                ? "Select a conversation..."
                : "Type a message..."
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="shrink-0 cursor-pointer rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:opacity-80 sm:px-5"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;