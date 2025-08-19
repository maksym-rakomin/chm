import {z} from "zod";
import {LoginSchema} from "@/lib/schema/login";

export interface LoginResponse {
  data?: {
    id: number;
    tokenable_type: string;
    tokenable_id: number;
    name: string;
    token: string;
    abilities: string[];
    last_used_at: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
    plain_text_token: string;
  };
  message: string | null;
  timestamp: string;
  errors?: {
    email?: string[];
    password?: string[];
  }
}

export type LoginValues = z.infer<typeof LoginSchema>
