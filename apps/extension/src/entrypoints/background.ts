import { authClient } from "@/lib/auth-client";
import { authTokenStorage } from "@/lib/auth-storage";
import {
  ExtensionMessaging,
  MessageGuards,
  type AppMessage,
  type MessageResponse,
} from "@/lib/messaging";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  // Initialize messaging handlers
  setupMessageHandlers();

  // Initial auth check
  authClient.getSession().then((session) => {
    console.log("Auth session in background:", session);
  });
});

function setupMessageHandlers() {
  // Handle popup open requests
  ExtensionMessaging.addListener(
    "OPEN_POPUP",
    async (): Promise<MessageResponse> => {
      try {
        await browser.action.openPopup();
        return { success: true };
      } catch (error) {
        console.error("Could not open popup:", error);
        // Fallback: open extension page in new tab
        try {
          await browser.tabs.create({
            url: browser.runtime.getURL("/popup.html"),
          });
          return { success: true, data: { method: "tab" } };
        } catch (tabError) {
          return { success: false, error: String(tabError) };
        }
      }
    }
  );

  // Handle popup logout - clear token and broadcast
  ExtensionMessaging.addListener(
    "POPUP_LOGOUT",
    async (): Promise<MessageResponse> => {
      try {
        // Clear token
        await authTokenStorage.setValue("");

        return { success: true };
      } catch (error) {
        console.error("Error handling popup logout:", error);
        return { success: false, error: String(error) };
      }
    }
  );

  // Handle error logging
  ExtensionMessaging.addListener(
    "LOG_EVENT",
    async (message): Promise<MessageResponse> => {
      if (message.payload) {
        console.log(`[${message.payload.event}]`, message.payload.data || "");
      }
      return { success: true };
    }
  );

  // Handle error reporting
  ExtensionMessaging.addListener(
    "ERROR",
    async (message): Promise<MessageResponse> => {
      if (MessageGuards.isError(message)) {
        console.error(
          "Extension Error:",
          message.payload.message,
          message.payload.code || ""
        );
      }
      return { success: true };
    }
  );

  console.log("Message handlers initialized");
}
