"use strict";

import { isErrorResponse } from "@/domain/domain";

// ✅ 1. Define the Base URL at the top
const API_BASE_URL = "https://vibepass-944b.onrender.com";

/**
 * Helper to handle API responses and consistent error throwing
 */
const handleResponse = async (response) => {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const responseBody = isJson ? await response.json() : null;

  if (!response.ok) {
    if (responseBody && isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error("API Error:", response.status, responseBody);
      throw new Error("An unknown error occurred");
    }
  }
  return responseBody;
};

/**
 * Helper to generate consistent headers
 */
const getHeaders = (accessToken) => {
  const headers = { "Content-Type": "application/json" };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return headers;
};

/* --- Event Management (Organizer) --- */

// ✅ 2. Use API_BASE_URL for all fetch calls
export const createEvent = async (accessToken, request) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/events`, {
    method: "POST",
    headers: getHeaders(accessToken),
    body: JSON.stringify(request),
  });
  return handleResponse(response);
};

export const updateEvent = async (accessToken, id, request) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/events/${id}`, {
    method: "PUT",
    headers: getHeaders(accessToken),
    body: JSON.stringify(request),
  });
  return handleResponse(response);
};

export const listEvents = async (accessToken, page) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/events?page=${page}&size=2`, {
    method: "GET",
    headers: getHeaders(accessToken),
  });
  return handleResponse(response);
};

export const getEvent = async (accessToken, id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/events/${id}`, {
    method: "GET",
    headers: getHeaders(accessToken),
  });
  return handleResponse(response);
};

export const deleteEvent = async (accessToken, id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/events/${id}`, {
    method: "DELETE",
    headers: getHeaders(accessToken),
  });
  return handleResponse(response);
};

/* --- Public Events (Attendee) --- */

export const listPublishedEvents = async (page) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/published-events?page=${page}&size=4`, {
    method: "GET",
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const addStaffToEvent = async (token, eventId, staffData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/staff/events/${eventId}`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(staffData),
  });
  return handleResponse(response);
};

export const searchPublishedEvents = async (query, page) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/published-events?q=${encodeURIComponent(query)}&page=${page}&size=4`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );
  return handleResponse(response);
};

export const getPublishedEvent = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/published-events/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return handleResponse(response);
};

/* --- Tickets --- */

export const purchaseTicket = async (accessToken, eventId, ticketTypeId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/events/${eventId}/ticket-types/${ticketTypeId}/tickets`,
    {
      method: "POST",
      headers: getHeaders(accessToken),
      body: JSON.stringify({}),
    }
  );
  return handleResponse(response);
};

export const listTickets = async (accessToken, page) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/tickets?page=${page}&size=8`, {
    method: "GET",
    headers: getHeaders(accessToken),
  });
  return handleResponse(response);
};

export const getTicket = async (accessToken, id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/tickets/${id}`, {
    method: "GET",
    headers: getHeaders(accessToken),
  });
  return handleResponse(response);
};

export const getTicketQr = async (accessToken, id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/tickets/${id}/qr-codes`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) throw new Error("Unable to get ticket QR code");
  return await response.blob();
};

/* --- Validations (Staff) --- */

export const validateTicket = async (accessToken, request) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/ticket-validations`, {
    method: "POST",
    headers: getHeaders(accessToken),
    body: JSON.stringify(request),
  });
  return handleResponse(response);
};