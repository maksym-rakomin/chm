"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth";

export function ClientBootstrap() {
  const { isLoaded, hydrateFromServer } = useAuthStore();
  useEffect(() => {
    if (!isLoaded) void hydrateFromServer();
  }, [isLoaded, hydrateFromServer]);
  return null;
}


