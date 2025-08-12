import { NextRequest, NextResponse } from "next/server";
import { getUserRoleServer, setUserRoleServer, getTokensServer } from "@/lib/api/tokenServer";
import { normalizeRole, UserRole } from "@/lib/types/roles";
import * as jose from "jose";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  const raw = await getUserRoleServer();
  const role = normalizeRole(raw) as UserRole;
  return NextResponse.json({ role });
}

export async function POST(_req: NextRequest) {
  try {
    const { accessToken } = await getTokensServer();
    if (!accessToken) {
      return NextResponse.json({ role: "guest" as UserRole }, { status: 200 });
    }

    const payload = jose.decodeJwt(accessToken);
    const roleClaim = (payload["role"] ?? payload["roles"]) as string | string[] | undefined;

    let role: UserRole = "guest";
    if (typeof roleClaim === "string") {
      role = normalizeRole(roleClaim);
    } else if (Array.isArray(roleClaim) && roleClaim.length > 0) {
      role = normalizeRole(String(roleClaim[0]));
    }

    await setUserRoleServer(role);
    return NextResponse.json({ role });
  } catch {
    return NextResponse.json({ role: "guest" as UserRole }, { status: 200 });
  }
}
