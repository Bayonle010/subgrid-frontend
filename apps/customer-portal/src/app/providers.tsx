"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { queryClient } from "@/lib/query-client";
import { ToastProvider } from "@/shared/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider defaultPlacement="top-right">
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
