import { cookies } from "next/headers";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID_KEY} from "@/lib/constants/token";

export async function getTokensServer() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get(ACCESS_TOKEN_KEY)?.value || null,
    refreshToken: cookieStore.get(REFRESH_TOKEN_KEY)?.value || null,
    userId: cookieStore.get(USER_ID_KEY)?.value || null,
  };
}

export async function setTokensServer({
                                  accessToken,
                                  refreshToken,
                                  userId,
                                }: {
  accessToken: string;
  refreshToken: string;
  userId: string;
}) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, { httpOnly: true, secure: true });
  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, { httpOnly: true, secure: true });
  cookieStore.set(USER_ID_KEY, userId, { httpOnly: true, secure: true });
}

export async function clearTokensServer() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
  cookieStore.delete(USER_ID_KEY);
}
