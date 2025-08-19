export type UserRole = "admin" | "manager" | "user" | "guest" | null;

export function normalizeRole(raw: string | null | undefined): UserRole {
  const value = (raw || "").toLowerCase();
  if (value === "admin" || value === "manager" || value === "user" || value === "guest") {
    return value;
  }
  return "guest";
}

export function hasAccess(userRole: UserRole, allowed: UserRole[] | "public"): boolean {
  if (allowed === "public") return true;
  return allowed.includes(userRole);
}


