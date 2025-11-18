import { browser } from "wxt/browser";

type Theme = "dark" | "light" | "system";

// Cross-browser auth token storage
export const authTokenStorage = {
  async getValue(): Promise<string> {
    try {
      const result = await browser.storage.local.get("auth-token");
      return result["auth-token"] || "";
    } catch (error) {
      console.error("Error getting auth token:", error);
      return "";
    }
  },

  async setValue(value: string): Promise<void> {
    try {
      await browser.storage.local.set({ "auth-token": value });
    } catch (error) {
      console.error("Error setting auth token:", error);
    }
  },

  watch(callback: (newValue: string | null, oldValue: string | null) => void) {
    const listener = (changes: { [key: string]: any }, areaName: string) => {
      if (areaName === "local" && changes["auth-token"]) {
        const change = changes["auth-token"];
        callback(change.newValue || null, change.oldValue || null);
      }
    };

    browser.storage.onChanged.addListener(listener);

    return () => {
      browser.storage.onChanged.removeListener(listener);
    };
  },
};

// Cross-browser theme storage
export const themeStorage = {
  async getValue(): Promise<Theme> {
    try {
      const result = await browser.storage.local.get("ui-theme");
      return (result["ui-theme"] as Theme) || "system";
    } catch (error) {
      console.error("Error getting theme:", error);
      return "system";
    }
  },

  async setValue(value: Theme): Promise<void> {
    try {
      await browser.storage.local.set({ "ui-theme": value });
    } catch (error) {
      console.error("Error setting theme:", error);
    }
  },

  watch(callback: (newValue: Theme | null, oldValue: Theme | null) => void) {
    const listener = (changes: { [key: string]: any }, areaName: string) => {
      if (areaName === "local" && changes["ui-theme"]) {
        const change = changes["ui-theme"];
        callback(
          (change.newValue as Theme) || null,
          (change.oldValue as Theme) || null
        );
      }
    };

    browser.storage.onChanged.addListener(listener);

    return () => {
      browser.storage.onChanged.removeListener(listener);
    };
  },
};
