import { createAuthClient } from "better-auth/react";
import { authTokenStorage } from "./auth-storage";
import { ExtensionMessaging } from "./messaging";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4137/auth/", // The base URL of your auth server
  fetchOptions: {
    onError(e) {
      console.error("Auth client error:", e);
    },
    onRequest(context) {
      console.log("Auth request:", context.url);
    },
    async onSuccess(context) {
      const authToken = context.response.headers.get("set-auth-token"); // get the token from the response headers

      // Store the token securely (e.g., in localStorage)
      if (authToken) {
        await authTokenStorage.setValue(authToken);
        ExtensionMessaging.sendToAllTabs({
          type: "TOKEN_UPDATED",
          payload: { token: authToken },
        });
      }
      console.log("Auth success:", context);
    },
  },
});

export const contentAuthClient = createAuthClient({
  baseURL: "http://localhost:4137/auth/", // The base URL of your auth server
  fetchOptions: {
    credentials: "omit",
    auth: {
      type: "Bearer",
      token: async () => {
        const token = await authTokenStorage.getValue();
        console.log("Retrieved token for content script:", token);
        return token;
      },
    },
    onError(e) {
      console.error("Content Auth client error:", e);
    },
    onRequest(context) {
      console.log("Content Auth request:", context.url);
    },
    onSuccess(context) {
      const authToken = context.response.headers.get("set-auth-token"); // get the token from the response headers
      // Store the token securely (e.g., in localStorage)
      if (authToken) {
        authTokenStorage.setValue(authToken);
      }
      console.log("Content Auth success:", context);
    },
  },
});
