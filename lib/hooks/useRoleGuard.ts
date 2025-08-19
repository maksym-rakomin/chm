"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth";
import { hasAccess } from "@/lib/types/roles";
import {resolveAccessForPath} from "@/lib/accessControl/map";

export function useRoleGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { role, isLoaded, hydrateFromServer } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) {
      void hydrateFromServer();
    }
  }, [isLoaded, hydrateFromServer]);

  useEffect(() => {
    const allowed = resolveAccessForPath(pathname);
    if (!allowed || allowed === "public") return;

    if (isLoaded && !hasAccess(role, allowed)) {
      router.replace("/forbidden");
    }
  }, [pathname, role, isLoaded, router]);
}


