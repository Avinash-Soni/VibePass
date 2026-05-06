/**
 * domain.js
 * * This file contains the domain constants and utility guards for the
 * Event Ticket Platform (VibePass).
 */

"use strict";

/**
 * Type Guard to check if a response is an ErrorResponse
 * @param {any} obj 
 * @returns {boolean}
 */
export const isErrorResponse = (obj) => {
  return (
    obj &&
    typeof obj === "object" &&
    "error" in obj &&
    typeof obj.error === "string"
  );
};

/**
 * Event Status Constants
 */
export const EventStatusEnum = Object.freeze({
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
});

/**
 * Ticket Status Constants
 */
export const TicketStatus = Object.freeze({
  PURCHASED: "PURCHASED",
  CANCELLED: "CANCELLED",
});

/**
 * Ticket Validation Method Constants
 */
export const TicketValidationMethod = Object.freeze({
  QR_SCAN: "QR_SCAN",
  MANUAL: "MANUAL",
});

/**
 * Ticket Validation Status Constants
 */
export const TicketValidationStatus = Object.freeze({
  VALID: "VALID",
  INVALID: "INVALID",
  EXPIRED: "EXPIRED",
});

/**
 * Note on Interfaces:
 * The TypeScript interfaces (CreateEventRequest, EventDetails, etc.) 
 * are implicitly handled by the object structures in your API calls.
 * * For SpringBootPagination handling:
 * Access pagination fields directly (e.g., pagination.content, pagination.totalPages).
 */