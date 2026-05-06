"use strict";

import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

// Page Imports
import Home from "./pages/Home";
import OrganizersLandingPage from "./pages/organizers-landing-page";
import CreateEventPage from "./pages/create-event-page";
import LoginPage from "./pages/login-page";
import CallbackPage from "./pages/callback-page";
import ListEventsPage from "./pages/list-events-page";
import PublishedEventsPage from "./pages/published-events-page";
import PurchaseTicketPage from "./pages/purchase-ticket-page";
import PurchasedTicketList from "./pages/purchased-ticket-list";
import DashboardPage from "./pages/dashboard-page";
import ViewTicketPage from "./pages/view-ticket-page";
import DashboardValidateQrPage from "./pages/dashboard-validate-qr-page";
import ProtectedRoute from "./components/protected-route";
import SignupPage from "./pages/signup-page";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/callback",
    Component: CallbackPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  { path: "/signup",
     Component: SignupPage },
  {
    path: "/events/:id",
    Component: PublishedEventsPage,
  },
  {
    path: "/events/:eventId/purchase/:ticketTypeId",
    element: (
      <ProtectedRoute>
        <PurchaseTicketPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/organizers",
    Component: OrganizersLandingPage,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/events",
    element: (
      <ProtectedRoute>
        <ListEventsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tickets",
    element: (
      <ProtectedRoute>
        <PurchasedTicketList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tickets/:id",
    element: (
      <ProtectedRoute>
        <ViewTicketPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/validate-qr",
    element: (
      <ProtectedRoute>
        <DashboardValidateQrPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/events/create",
    element: (
      <ProtectedRoute>
        <CreateEventPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/events/update/:id",
    element: (
      <ProtectedRoute>
        <CreateEventPage />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;