"use strict";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind CSS classes without style conflicts.
 * It combines 'clsx' for conditional class logic and 'twMerge' 
 * to ensure the last class defined wins (e.g., 'p-4 p-2' becomes 'p-2').
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}