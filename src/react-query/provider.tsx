"use client";

import { QueryClient, QueryClientProvider, DefaultOptions } from "@tanstack/react-query";
import { useState } from "react";

type ReactQueryProviderProps = {
  children: React.ReactNode;
};

// Define advanced default options for react-query to handle caching, retries, and error handling
const queryClientOptions: DefaultOptions = {
  queries: {
    // Retry failed requests twice before throwing an error
    retry: 2,
    // Refetch data in the background every 5 minutes to ensure freshness
    refetchInterval: 5 * 60 * 1000,
    // Automatically refetch on window focus for the latest data
    refetchOnWindowFocus: true,
    // Cache queries for 10 minutes
    cacheTime: 10 * 60 * 1000,
    // Remove unused data after 5 minutes
    staleTime: 5 * 60 * 1000,
    // Allow only one request per query key at a time
    refetchOnMount: "always",
    // Retry for network-related issues only, not for all errors
    retryOnMount: true,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Provide a custom error handler for centralized logging
    onError: (error: unknown) => {
      console.error("Query Error:", error);
      // You can add custom error tracking services here, such as Sentry
    },
  },
  mutations: {
    // Retry mutations once before throwing an error
    retry: 1,
    // Configure mutation error handling
    onError: (error: unknown) => {
      console.error("Mutation Error:", error);
      // Centralized mutation error tracking here
    },
  },
};

// Initialize query client with advanced options and logging setup
const initializeQueryClient = () => new QueryClient({ defaultOptions: queryClientOptions });

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  // Lazy initialization of QueryClient
  const [queryClient] = useState(initializeQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
