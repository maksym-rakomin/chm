import Cookies from "js-cookie";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID_KEY} from "@/lib/constants/token";

export async function getTokensClient() {
  return {
    accessToken: Cookies.get(ACCESS_TOKEN_KEY) || null,
    refreshToken: Cookies.get(REFRESH_TOKEN_KEY) || null,
    userId: Cookies.get(USER_ID_KEY) || null,
  };
}

export async function setTokensClient({
                                  accessToken,
                                  refreshToken,
                                  userId,
                                }: {
  accessToken: string;
  refreshToken: string;
  userId: string;
}) {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { secure: true });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { secure: true });
  Cookies.set(USER_ID_KEY, userId, { secure: true });
}

export async function clearTokensClient() {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(USER_ID_KEY);
}
