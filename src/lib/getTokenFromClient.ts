import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    console.error("Token error:", error);
    throw new Error("Failed to get authentication token");
  }

  return data.token;
};