"use strict";

import * as React from "react";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // ✅ Your custom context
import { useNavigate } from "react-router-dom";

const CallbackPage = () => {
  // 1. Get 'token' and 'isLoading' from your custom context
  const { token, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 2. Wait for the local storage check/token validation to finish
    if (isLoading) return;

    // 3. If a token exists, the user is logged in
    if (token) {
      const redirectPath = localStorage.getItem("redirectPath") || "/dashboard";
      localStorage.removeItem("redirectPath");
      navigate(redirectPath, { replace: true });
    } else {
      // 4. If no token, they shouldn't be here; send them to login
      navigate("/login", { replace: true });
    }
  }, [isLoading, token, navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-950 text-white">
      <div className="relative flex items-center justify-center">
        <div className="absolute size-16 rounded-full border-2 border-primary/20 animate-ping" />
        <div className="size-12 rounded-full border-t-2 border-primary animate-spin" />
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold tracking-tight">Authenticating Session</h2>
        <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">
          Finalizing secure connection...
        </p>
      </div>
    </div>
  );
};

export default CallbackPage;