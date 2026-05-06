"use strict";

import * as React from "react";
import { useRoles } from "@/hooks/use-roles";
import { Navigate } from "react-router";

const DashboardPage = () => {
  const { isLoading, isOrganizer, isStaff } = useRoles();

  // Show a professional loading state while roles are being decoded from the JWT
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-950 text-white">
        <div className="relative flex items-center justify-center">
          <div className="absolute size-16 rounded-full border-2 border-primary/20 animate-ping" />
          <div className="size-12 rounded-full border-t-2 border-primary animate-spin" />
        </div>
        <div className="mt-8 flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight">Preparing Dashboard</h2>
          <p className="text-xs text-gray-500 font-medium tracking-[0.2em] uppercase">
            Personalizing your experience...
          </p>
        </div>
      </div>
    );
  }

  // Organizer: Primary focus is managing their own events
  if (isOrganizer) {
    return <Navigate to="/organizers" replace />;
  }

  // Staff: Primary focus is validating attendee tickets via QR
  if (isStaff) {
    return <Navigate to="/dashboard/validate-qr" replace />;
  }

  // Attendee (Default): Primary focus is viewing their purchased tickets
  return <Navigate to="/dashboard/tickets" replace />;
};

export default DashboardPage;