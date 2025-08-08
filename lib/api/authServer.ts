import { createAuthFetch } from "./authApi";
import { getTokensServer, setTokensServer, clearTokensServer } from "./tokenServer";
import {TokenStorage} from "@/lib/types/token";

const serverTokenStorage: TokenStorage = {
  get: getTokensServer,
  set: setTokensServer,
  clear: clearTokensServer,
};

export const authFetch = createAuthFetch(serverTokenStorage);
