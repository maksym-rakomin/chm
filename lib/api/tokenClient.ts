import Cookies from "js-cookie";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, ROLE_KEY, USER_ID_KEY} from "@/lib/constants/token";
import {decryptValue, encryptValue} from "@/lib/utils/cryptoClient";
import {UserRole, normalizeRole} from "@/lib/types/roles";
import {Tokens} from "@/lib/types/token";

export async function getTokensClient():Promise<Tokens> {
  const encAccess = Cookies.get(ACCESS_TOKEN_KEY) || null;
  const encRefresh = Cookies.get(REFRESH_TOKEN_KEY) || null;
  const encUserId = Cookies.get(USER_ID_KEY) || null;
  const encRole = Cookies.get(ROLE_KEY) || null;

  const decryptedUserId = await decryptValue(encUserId);
  const decryptedRole = await decryptValue(encRole);

  return {
    accessToken: await decryptValue(encAccess),
    refreshToken: await decryptValue(encRefresh),
    userId: decryptedUserId ? parseInt(decryptedUserId, 10) : null,
    role: normalizeRole(decryptedRole),
  };
}

export async function setTokensClient({
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
  const encAccess = await encryptValue(accessToken);
  const encRefresh = await encryptValue(refreshToken);
  const encUserId = await encryptValue(userId.toString());

  Cookies.set(ACCESS_TOKEN_KEY, encAccess, {secure: true, sameSite: "lax"});
  Cookies.set(REFRESH_TOKEN_KEY, encRefresh, {secure: true, sameSite: "lax"});
  Cookies.set(USER_ID_KEY, encUserId, {secure: true, sameSite: "lax"});

  if (role) {
    const encRole = await encryptValue(role);
    Cookies.set(ROLE_KEY, encRole, {secure: true, sameSite: "lax"});
  }
}

export async function clearTokensClient() {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(USER_ID_KEY);
  Cookies.remove(ROLE_KEY);
}

export async function setUserRoleClient(role: UserRole) {
  if (role) {
    const encRole = await encryptValue(role);
    Cookies.set(ROLE_KEY, encRole, {secure: true, sameSite: "lax"});
  }
}

export async function getUserRoleClient(): Promise<UserRole> {
  const encRole = Cookies.get(ROLE_KEY) || null;
  const decryptedRole = await decryptValue(encRole);
  return normalizeRole(decryptedRole);
}
