import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { signupUser } from "../../services/authService";
import { createUserProfile } from "../../services/userService";
import { validateSignup } from "../../utils/validation";

export const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const fieldErrors = validateSignup({
        ...formData,
        [name]: value,
      });

      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name] || "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const fieldErrors = validateSignup(formData);

    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name] || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      password: true,
    });

    const validationErrors = validateSignup(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const user = await signupUser(formData);

      await createUserProfile(user, formData.name);

      toast.success("Account created successfully!");

      navigate("/");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered.",
        }));
      } else if (error.code === "auth/weak-password") {
        setErrors((prev) => ({
          ...prev,
          password: "Password is too weak.",
        }));
      } else if (error.code === "auth/invalid-email") {
        setErrors((prev) => ({
          ...prev,
          email: "Invalid email address.",
        }));
      } else {
        toast.error("Unable to create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#eef2ff_40%,_#f8fafc_100%)] px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Start chatting with people instantly
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your name"
              className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.name
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-indigo-300 focus:ring-indigo-100"
              }`}
            />

            {errors.name && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.email
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-indigo-300 focus:ring-indigo-100"
              }`}
            />

            {errors.email && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Create a password"
                className={`w-full rounded-xl border bg-slate-50 px-4 py-3 pr-11 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                  errors.password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-indigo-300 focus:ring-indigo-100"
                }`}
              />

              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.58 10.58A2 2 0 0013.4 13.4M9.88 5.08A10.94 10.94 0 0112 5c4.97 0 9 4.5 9 7a12.3 12.3 0 01-3.62 4.92M6.61 6.61A12.54 12.54 0 003 12c0 2.5 4.03 7 9 7 1.61 0 3.14-.33 4.5-.92" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;