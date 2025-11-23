// This file creates the API client for communicating with the backend.
// It sets up the base URL and adds the auth token to requests.
// client.ts
import { treaty } from "@elysiajs/eden";
import type { App } from "@noteminds/backend";
import { authTokenStorage } from "./auth-storage";

export const baseUrl = "http://localhost:4137";

export const client = treaty<App>(baseUrl, {
  async fetcher(url, options) {
    const token = await authTokenStorage.getValue();

    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
});
