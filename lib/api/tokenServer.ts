import {cookies} from "next/headers";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, ROLE_KEY, USER_ID_KEY} from "@/lib/constants/token";
import {decryptValueServer, encryptValueServer} from "@/lib/utils/cryptoServer";
import {UserRole, normalizeRole} from "@/lib/types/roles";

export async function getTokensServer() {
  const cookieStore = await cookies();
  const decryptedUserId = decryptValueServer(cookieStore.get(USER_ID_KEY)?.value || null);
  const decryptedRole = decryptValueServer(cookieStore.get(ROLE_KEY)?.value || null);

  return {
    accessToken: decryptValueServer(cookieStore.get(ACCESS_TOKEN_KEY)?.value || null),
    refreshToken: decryptValueServer(cookieStore.get(REFRESH_TOKEN_KEY)?.value || null),
    userId: decryptedUserId ? parseInt(decryptedUserId, 10) : null,
    role: normalizeRole(decryptedRole),
  };
}

export async function setTokensServer({
                                        accessToken,
                                        refreshToken,
                                        userId,
                                        role
                                      }: {
  accessToken: string;
  refreshToken: string;
  userId: number;
  role?: UserRole;
}) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_KEY, encryptValueServer(accessToken), {httpOnly: true, secure: true, sameSite: "lax"});
  cookieStore.set(REFRESH_TOKEN_KEY, encryptValueServer(refreshToken), {httpOnly: true, secure: true, sameSite: "lax"});
  cookieStore.set(USER_ID_KEY, encryptValueServer(userId.toString()), {httpOnly: true, secure: true, sameSite: "lax"});

  if (role) {
    cookieStore.set(ROLE_KEY, encryptValueServer(role), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  }

}

export async function clearTokensServer() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
  cookieStore.delete(USER_ID_KEY);
  cookieStore.delete(ROLE_KEY);
}

export async function setUserRoleServer(role: UserRole) {
  if (role) {
    const cookieStore = await cookies();
    cookieStore.set(ROLE_KEY, encryptValueServer(role), {httpOnly: true, secure: true, sameSite: "lax"});
  }
}

export async function getUserRoleServer(): Promise<UserRole> {
  const cookieStore = await cookies();
  const decryptedRole = decryptValueServer(cookieStore.get(ROLE_KEY)?.value || null);
  return normalizeRole(decryptedRole);
}
