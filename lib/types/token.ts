import {UserRole} from "@/lib/types/roles";

export interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
  role?: UserRole;
}

export interface TokenStorage {
  get: () => Promise<Tokens>;
  set: (tokens: { accessToken: string; refreshToken: string; userId: number; role?: UserRole }) => Promise<void>;
  clear: () => Promise<void>;
}
