import { UserRole } from "@/lib/types/roles";

// Define navigation groups as the single source of truth for protected app pages.
// Icons are referenced by string ids so this module stays UI-agnostic and safe for server/middleware usage.
export type IconId =
  | "home"
  | "users"
  | "userCheck"
  | "calendar"
  | "fileText"
  | "clipboardList"
  | "trendingUp"
  | "messageSquare"
  | "bell";

export type NavigationItem = {
  title: string;
  url: string;
  icon: IconId;
  roles: UserRole[]; // roles allowed to see this route
};

export type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  // {
  //   title: "Overview",
  //   items: [
  //     { title: "Dashboard", url: "/", icon: "home", roles: ["admin", "manager", "user"] },
  //   ],
  // },
  // {
  //   title: "Management",
  //   items: [
  //     { title: "Patients", url: "/patients", icon: "users", roles: ["admin", "manager", "user"] },
  //     { title: "Staff", url: "/staff", icon: "userCheck", roles: ["admin", "manager"] },
  //     { title: "Schedule", url: "/schedule", icon: "calendar", roles: ["admin", "manager", "user"] },
  //   ],
  // },
  // {
  //   title: "Operations",
  //   items: [
  //     { title: "Documents", url: "/documents", icon: "fileText", roles: ["admin", "manager"] },
  //     { title: "Status Tracker", url: "/status", icon: "clipboardList", roles: ["admin", "manager", "user"] },
  //     { title: "Reports", url: "/reports", icon: "trendingUp", roles: ["admin", "manager"] },
  //   ],
  // },
  // {
  //   title: "Communication",
  //   items: [
  //     { title: "Messages", url: "/messages", icon: "messageSquare", roles: ["admin", "manager", "user"] },
  //     { title: "Notifications", url: "/notifications", icon: "bell", roles: ["admin", "manager", "user"] },
  //   ],
  // },
];

// Publicly accessible routes (no auth required)
export const publicRoutes: Record<string, "public"> = {
  "/login": "public",
  "/forbidden": "public",
  "/401": "public",
  "/403": "public",
};

// Extra protected routes that are not a part of the sidebar groups
export const extraProtectedRoutes: Record<string, UserRole[]> = {
  "/settings": ["admin", "manager", "user"],
  "/admin": ["admin"],
};
