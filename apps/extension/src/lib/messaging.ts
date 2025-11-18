import React from "react";
import { browser } from "wxt/browser";

// Message Types - Token-based auth flow for popup (cookies) + content script (bearer)
export type AppMessage =
  | { type: "POPUP_LOGOUT"; payload?: any }
  | { type: "TOKEN_UPDATED"; payload: { token: string } }
  | {
      type: "OPEN_POPUP";
      payload?: {
        windowId?: number;
      };
    }
  | { type: "LOG_EVENT"; payload: { event: string; data?: any } }
  | { type: "ERROR"; payload: { message: string; code?: string } };

// Response wrapper for async messages
export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Messaging utility class
export class ExtensionMessaging {
  private static listeners = new Map<string, Function[]>();

  // Send message to background script
  static async sendToBackground<T = any>(
    message: AppMessage
  ): Promise<MessageResponse<T>> {
    try {
      const response = await browser.runtime.sendMessage(message);
      return response || { success: true };
    } catch (error) {
      console.error("Failed to send message to background:", error);
      return { success: false, error: String(error) };
    }
  }

  // Send message to specific tab
  static async sendToTab<T = any>(
    tabId: number,
    message: AppMessage
  ): Promise<MessageResponse<T>> {
    try {
      const response = await browser.tabs.sendMessage(tabId, message);
      return response || { success: true };
    } catch (error) {
      console.error(`Failed to send message to tab ${tabId}:`, error);
      return { success: false, error: String(error) };
    }
  }

  // Send message to all tabs
  static async sendToAllTabs(message: AppMessage): Promise<void> {
    try {
      const tabs = await browser.tabs.query({});
      const promises = tabs
        .filter((tab) => tab.id)
        .map((tab) => this.sendToTab(tab.id!, message));

      await Promise.allSettled(promises);
    } catch (error) {
      console.error("Failed to send message to all tabs:", error);
    }
  }

  // Add message listener
  static addListener(
    messageType: AppMessage["type"] | "all",
    handler: (
      message: AppMessage,
      sender?: any
    ) => Promise<MessageResponse> | MessageResponse | void
  ): () => void {
    const listeners = this.listeners.get(messageType) || [];
    listeners.push(handler);
    this.listeners.set(messageType, listeners);

    // Setup runtime listener if first listener
    if (this.listeners.size === 1) {
      this.setupRuntimeListener();
    }

    // Return cleanup function
    return () => {
      const currentListeners = this.listeners.get(messageType) || [];
      const index = currentListeners.indexOf(handler);
      if (index > -1) currentListeners.splice(index, 1);
    };
  }

  // Remove all listeners for a message type
  static removeListeners(messageType: AppMessage["type"] | "all"): void {
    this.listeners.delete(messageType);
  }

  // Setup the main runtime message listener
  private static setupRuntimeListener(): void {
    browser.runtime.onMessage.addListener(
      async (message: AppMessage, sender, sendResponse) => {
        try {
          // Handle specific message type listeners
          const typeListeners = this.listeners.get(message.type) || [];
          const allListeners = this.listeners.get("all") || [];
          const allHandlers = [...typeListeners, ...allListeners];

          if (allHandlers.length === 0) {
            return {
              success: false,
              error: `No handler for message type: ${message.type}`,
            };
          }

          // Execute handlers and return first response
          for (const handler of allHandlers) {
            try {
              const result = await handler(message, sender);
              if (result) {
                return result;
              }
            } catch (error) {
              console.error(
                `Error in message handler for ${message.type}:`,
                error
              );
              return { success: false, error: String(error) };
            }
          }

          return { success: true };
        } catch (error) {
          console.error("Error in runtime message listener:", error);
          return { success: false, error: String(error) };
        }
      }
    );
  }
}

// Convenience hooks for React components
export function useMessageListener(
  messageType: AppMessage["type"] | "all",
  handler: (
    message: AppMessage,
    sender?: any
  ) => Promise<MessageResponse> | MessageResponse | void
) {
  React.useEffect(() => {
    const cleanup = ExtensionMessaging.addListener(messageType, handler);
    return cleanup;
  }, [messageType, handler]);
}

// Message type guards for token-based auth
export const MessageGuards = {
  isPopupLogout(
    message: AppMessage
  ): message is { type: "POPUP_LOGOUT"; payload?: any } {
    return message.type === "POPUP_LOGOUT";
  },
  isTokenUpdated(message: AppMessage): message is {
    type: "TOKEN_UPDATED";
    payload: { token: string };
  } {
    return message.type === "TOKEN_UPDATED";
  },
  isError(
    message: AppMessage
  ): message is { type: "ERROR"; payload: { message: string; code?: string } } {
    return message.type === "ERROR";
  },
};

// Utility functions for token-based auth messaging
export const MessageUtils = {
  // Popup logout - clears tokens in content scripts
  async broadcastLogout(): Promise<void> {
    await ExtensionMessaging.sendToAllTabs({ type: "POPUP_LOGOUT" });
  },
  // Token management
  async broadcastTokenUpdate(token: string): Promise<void> {
    await ExtensionMessaging.sendToAllTabs({
      type: "TOKEN_UPDATED",
      payload: { token },
    });
  },

  // Log events to background
  async logEvent(event: string, data?: any): Promise<void> {
    await ExtensionMessaging.sendToBackground({
      type: "LOG_EVENT",
      payload: { event, data },
    });
  },

  // Error reporting
  async reportError(message: string, code?: string): Promise<void> {
    await ExtensionMessaging.sendToBackground({
      type: "ERROR",
      payload: { message, code },
    });
  },
};
