// Derived access map from navigation groups + extra/public routes
import {UserRole} from "@/lib/types/roles";
import {extraProtectedRoutes, navigationGroups, publicRoutes} from "@/lib/constants/navigation";

export const accessMap: Record<string, UserRole[] | "public"> = (() => {
  const map: Record<string, UserRole[] | "public"> = { ...publicRoutes };

  // Collect from navigation groups
  for (const group of navigationGroups) {
    for (const item of group.items) {
      map[item.url] = item.roles;
    }
  }

  // Add extra protected routes
  for (const [url, roles] of Object.entries(extraProtectedRoutes)) {
    map[url] = roles;
  }

  return map;
})();

// Same resolver logic as before, kept here to be the single source of truth
export function resolveAccessForPath(pathname: string): UserRole[] | "public" | undefined {
  if (accessMap[pathname]) return accessMap[pathname];

  const segments = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);
  if (segments.length === 0) return accessMap["/"];

  let probe = "";
  for (let i = 0; i < segments.length; i++) {
    probe += "/" + segments[i];
    if (accessMap[probe]) return accessMap[probe];
  }
  return undefined;
}


