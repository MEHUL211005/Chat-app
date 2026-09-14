import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const VerifyEmail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleCheckVerification = async () => {
    try {
      setLoading(true);

      await user.reload();

      if (auth.currentUser?.emailVerified) {
        toast.success("Email verified successfully!");
        navigate("/");
      } else {
        toast.error("Email is not verified yet.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to check verification status.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setLoading(true);

      await sendEmailVerification(auth.currentUser);

      toast.success("Verification email sent again.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-2xl">
          ✉️
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-800">
          Verify your email
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          We've sent a verification link to:
        </p>

        <p className="mt-1 break-all font-medium text-slate-800">
          {user?.email}
        </p>

        <p className="mt-4 text-sm leading-6 text-slate-500">
          Please check your inbox and click the verification link.
          After verifying, come back here and click the button below.
        </p>

        <button
          type="button"
          onClick={handleCheckVerification}
          disabled={loading}
          className="mt-6 w-full cursor-pointer rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Checking..." : "I've verified my email"}
        </button>

        <button
          type="button"
          onClick={handleResendEmail}
          disabled={loading}
          className="mt-3 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Resend verification email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;