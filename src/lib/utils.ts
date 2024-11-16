import { createClient } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to merge and clean class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Initialize Supabase client with environment variable checks
export const supabaseClient = (() => {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are missing");
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();

// Truncate string to a maximum length (max 60 characters) with an ellipsis for overflow
export const truncateString = (string: string, maxLength: number = 60) => {
  if (string.length > maxLength) {
    return string.slice(0, maxLength) + "...";
  }
  return string;
};

// URL validation and type detection for YouTube, Loom, or fallback as Image
export const validateURLString = (url: string) => {
  const urlPatterns = {
    YOUTUBE: /www\.youtube\.com/,
    LOOM: /www\.loom\.com/,
  };

  const matchingType = Object.entries(urlPatterns).find(([type, regex]) => regex.test(url));

  if (matchingType) {
    const [type] = matchingType;
    return { url, type };
  }

  // Return as "IMAGE" if no match, ensure URL is well-formed
  try {
    new URL(url); // Ensures the URL is valid
    return { url, type: "IMAGE" };
  } catch (e) {
    return { url: undefined, type: "INVALID" }; // Return undefined if URL is invalid
  }
};
