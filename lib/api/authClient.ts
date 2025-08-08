"use client";

import { createAuthFetch } from "./authApi";
import { getTokensClient, setTokensClient, clearTokensClient } from "./tokenClient";
import {TokenStorage} from "@/lib/types/token";

const clientTokenStorage: TokenStorage = {
  get: getTokensClient,
  set: setTokensClient,
  clear: clearTokensClient,
};

export const authFetch = createAuthFetch(clientTokenStorage);
