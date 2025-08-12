import { UserRole } from "@/lib/types/roles";

// Карта доступов для маршрутов. Используем пути app router (pathname без параметров)
// "public" означает доступ всем, включая гостям. Иначе — список ролей с доступом.
export const accessMap: Record<string, UserRole[] | "public"> = {
  "/": ["admin", "manager", "user"],
  "/login": "public",
  "/forbidden": "public",
  "/401": "public",
  "/403": "public",

  // Dashboard (route group is invisible in URL)
  "/patients": ["admin", "manager", "user"],
  "/documents": ["admin", "manager"],
  "/reports": ["admin", "manager"],
  "/schedule": ["admin", "manager", "user"],
  "/staff": ["admin", "manager"],
  "/messages": ["admin", "manager", "user"],
  "/notifications": ["admin", "manager", "user"],
  "/status": ["admin", "manager", "user"],
  "/admin": ["admin"],
};

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


