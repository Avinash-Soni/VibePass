"use strict";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext"; // 👈 CHANGE THIS IMPORT

/**
 * Custom hook to manage user roles within VibePass.
 */
export const useRoles = () => {
  // Use 'user' and 'token' from your custom AuthContext
  const { user, token } = useAuth();

  const roleData = useMemo(() => {
    // 1. If no token exists, the user is definitely not authenticated
    if (!token) {
      return {
        role: null,
        isOrganizer: false,
        isAttendee: false,
        isStaff: false,
        isLoading: false,
      };
    }

    // 2. If token exists but user object hasn't been decoded by AuthContext yet
    if (token && !user) {
      return {
        role: null,
        isOrganizer: false,
        isAttendee: false,
        isStaff: false,
        isLoading: true, // Still waiting for useEffect in AuthContext
      };
    }

    // 3. Token is valid and user is decoded
    const role = user.role; // This is the 'ROLE_ORGANIZER' string we set in AuthContext

    return {
      role: role,
      isOrganizer: role === "ROLE_ORGANIZER",
      isAttendee: role === "ROLE_ATTENDEE",
      isStaff: role === "ROLE_STAFF",
      isLoading: false,
    };
  }, [user, token]);

  return roleData;
};