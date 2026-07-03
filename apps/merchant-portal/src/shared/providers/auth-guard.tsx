"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/auth.store";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // If already hydrated before this effect runs
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const user = useAuthStore.getState().user;
    if (!user?.accessToken) {
      router.replace("/login");
    }
  }, [isHydrated, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-brand-secondary-text-icons border-t-transparent animate-spin" />
          <p className="text-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const user = useAuthStore.getState().user;
  if (!user?.accessToken) return null;

  return <>{children}</>;
};
