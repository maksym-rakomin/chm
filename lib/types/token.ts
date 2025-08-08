export interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
}

export interface TokenStorage {
  get: () => Promise<Tokens>;
  set: (tokens: { accessToken: string; refreshToken: string; userId: string }) => Promise<void>;
  clear: () => Promise<void>;
}
