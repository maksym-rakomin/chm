import { NextResponse, NextRequest } from "next/server";
import { ROLE_KEY } from "@/lib/constants/token";
import { normalizeRole, hasAccess } from "@/lib/types/roles";
import { decryptValueEdge } from "@/lib/utils/cryptoEdge";
import {resolveAccessForPath} from "@/lib/accessControl/map";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const allowed = resolveAccessForPath(pathname);

  if (!allowed) {
    return NextResponse.next();
  }

  if (allowed === "public") {
    return NextResponse.next();
  }

  const encRole = request.cookies.get(ROLE_KEY)?.value || null;

  const role = normalizeRole(await decryptValueEdge(encRole));

  if (hasAccess(role, allowed)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/forbidden";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
