import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
      }}
    />

    <App />
  </AuthProvider>,
);