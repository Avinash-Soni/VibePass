// src/components/protected-route.jsx
import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuth(); // Removed isLoading/isAuthenticated
  const location = useLocation();

  // If there's no token in context or localStorage, they aren't logged in
  if (!token) {
    // Save current path to redirect back after successful login
    const fullPath = window.location.pathname + window.location.search;
    localStorage.setItem("redirectPath", fullPath);

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: If you have the token but the user object hasn't been decoded yet
  if (token && !user) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-950 text-white z-50">
        <div className="size-12 rounded-full border-t-2 border-primary animate-spin" />
        <p className="mt-4 text-gray-400">Loading User Profile...</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;