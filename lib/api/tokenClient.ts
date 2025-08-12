import Cookies from "js-cookie";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, ROLE_KEY, USER_ID_KEY} from "@/lib/constants/token";
import {decryptValue, encryptValue} from "@/lib/utils/cryptoClient";
import {UserRole} from "@/lib/types/roles";

export async function getTokensClient() {
  const encAccess = Cookies.get(ACCESS_TOKEN_KEY) || null;
  const encRefresh = Cookies.get(REFRESH_TOKEN_KEY) || null;
  const encUserId = Cookies.get(USER_ID_KEY) || null;
  const encRole = Cookies.get(ROLE_KEY) || null;

  return {
    accessToken: await decryptValue(encAccess),
    refreshToken: await decryptValue(encRefresh),
    userId: await decryptValue(encUserId),
    role: await decryptValue(encRole),
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
  userId: string;
  role?: UserRole;
}) {
  const encAccess = await encryptValue(accessToken);
  const encRefresh = await encryptValue(refreshToken);
  const encUserId = await encryptValue(userId);

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

export async function setUserRoleClient(role: string) {
  const encRole = await encryptValue(role);
  Cookies.set(ROLE_KEY, encRole, {secure: true, sameSite: "lax"});
}

export async function getUserRoleClient(): Promise<string | null> {
  return decryptValue(Cookies.get(ROLE_KEY) || null);
}
