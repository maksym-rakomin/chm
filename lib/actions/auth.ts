import {LoginResponse, LoginValues} from "@/lib/types/login";
import {publicFetch} from "@/lib/api/publicApi";

export const getLogin = async (values: LoginValues): Promise<LoginResponse> => await publicFetch<LoginResponse>("/authorization/login", {
  method: "POST",
  body: JSON.stringify(values),
})
