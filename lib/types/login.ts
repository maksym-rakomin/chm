import {z} from "zod";
import {LoginSchema} from "@/lib/schema/login";

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  userId: string
}

export type LoginValues = z.infer<typeof LoginSchema>
