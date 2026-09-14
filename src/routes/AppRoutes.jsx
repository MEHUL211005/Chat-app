import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Chat from "../pages/chat/Chat";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ProtectedRoute from "./ProtectedRoute";
import VerifiedRoute from "./VerifiedRoute";
import PublicRoute from "./PublicRoute";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <ProtectedRoute>
              <VerifyEmail />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
       <Route
  path="/"
  element={
    <VerifiedRoute>
      <Chat />
    </VerifiedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;