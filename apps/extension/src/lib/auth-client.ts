import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4137/auth/", // The base URL of your auth server
  fetchOptions: {
    onError(e) {
      console.error("Auth client error:", e);
    },
    onRequest(context) {
      console.log("Auth request:", context.url);
    },
    onSuccess(context) {
      console.log("Auth success:", context);
    },
  },
});
