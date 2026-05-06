"use strict";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

/**
 * Keycloak / OIDC Configuration
 * * Authority: Local Keycloak Realm
 * * Client: event-ticket-platform-app
 */
const oidcConfig = {
  authority: "http://localhost:9090/realms/event-ticket-platform",
  client_id: "event-ticket-platform-app",
  redirect_uri: "http://localhost:5173/callback",
  response_type: "code",
  scope: "openid profile email",
  automaticSilentRenew: true,
  loadUserInfo: true,
  onSigninCallback: () => {
    // Clear URL fragments after successful login
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);