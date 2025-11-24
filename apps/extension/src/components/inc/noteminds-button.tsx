"use client";

import type React from "react";

import { useState } from "react";
import {
  Power,
  MessageSquare,
  X,
  ScanTextIcon,
  BrainCircuitIcon,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import NotemindLogo from "@/assets/icon.png";
import { ExtensionMessaging } from "@/lib/messaging";
import { $api } from "@/lib/api";
import { extractContent } from "@/lib/content-extractor";
import { useContentStore } from "@/lib/store";
export function NotemindsButton({
  user,
  isOpen,
  onToggle,
}: {
  user?: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { webpageId, setWebpage } = useContentStore();
  const { mutate, isPending } = $api.useMutation("post", "/webpage/analyze", {
    onSuccess: (data) => {
      const webpage = (data as any).data.webpage;
      setWebpage(webpage.id, webpage.title);
      console.log("Webpage analyzed:", data);
      onToggle();
    },
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(true);
  const [showPowerPopover, setShowPowerPopover] = useState(false);
  const [showFeedbackPopover, setShowFeedbackPopover] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const isAnyPopoverOpen = showPowerPopover || showFeedbackPopover;

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Feedback submitted:", feedbackText);
    setFeedbackText("");
    setShowFeedbackPopover(false);
    setIsExpanded(false);
  };

  const handlePowerDisable = () => {
    setIsExtensionEnabled(false);
    setShowPowerPopover(false);
    setIsExpanded(false);
    console.log("Extension disabled");
  };

  const handlePowerCancel = () => {
    setShowPowerPopover(false);
    setIsExpanded(false);
  };

  const handleFeedbackClose = () => {
    setShowFeedbackPopover(false);
    setIsExpanded(false);
  };

  const handlePowerClose = () => {
    setShowPowerPopover(false);
    setIsExpanded(false);
  };

  // Hide button when sidebar is open or extension is disabled
  if (isOpen || !isExtensionEnabled) {
    return null;
  }
  if (!user) {
    return (
      <div className="fixed right-8 bottom-8 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                // send message to login with popup
                ExtensionMessaging.sendToBackground({ type: "OPEN_POPUP" });
              }}
              variant="default"
              size="icon-lg"
              className="border-border relative rounded-full border shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isExpanded ? (
                <ScanTextIcon className="h-5 w-5" />
              ) : (
                <img
                  src={NotemindLogo}
                  alt="NoteMinds Logo"
                  className="size-8"
                />
              )}
              {/* Badge */}
              <div className="absolute -top-1 -right-1 flex size-3 items-center justify-center rounded-full bg-blue-600 px-1.5 before:absolute before:size-3 before:animate-ping before:rounded-full before:bg-blue-600"></div>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Login in Popup</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
  return (
    <div
      className="fixed right-8 bottom-8 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => !isAnyPopoverOpen && setIsExpanded(false)}
    >
      <div className="flex items-center gap-2">
        <div
          className={`relative transition-all duration-300 ease-out ${
            isExpanded
              ? "translate-x-0 opacity-100"
              : "pointer-events-none translate-x-4 opacity-0"
          }`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setShowPowerPopover(!showPowerPopover)}
                variant="outline"
                size="icon-sm"
                className="rounded-full shadow-lg hover:shadow-xl"
                aria-label="Power settings"
              >
                <Power className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Disable extension</p>
            </TooltipContent>
          </Tooltip>

          {showPowerPopover && (
            <div className="bg-popover text-popover-foreground animate-in fade-in slide-in-from-bottom-2 absolute right-0 bottom-14 w-64 rounded-2xl border p-4 shadow-2xl duration-200">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-sm font-semibold">Disable Extension</h3>
                <Button
                  onClick={handlePowerClose}
                  variant="ghost"
                  size="icon-sm"
                  className="h-6 w-6 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                Disable the extension temporarily. You can re-enable it anytime
                from this menu.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handlePowerCancel}
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePowerDisable}
                  size="sm"
                  className="flex-1 rounded-full"
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </div>

        <div
          className={`relative transition-all delay-75 duration-300 ease-out ${
            isExpanded
              ? "translate-x-0 opacity-100"
              : "pointer-events-none translate-x-4 opacity-0"
          }`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setShowFeedbackPopover(!showFeedbackPopover)}
                variant="outline"
                size="icon-sm"
                className="rounded-full shadow-lg hover:shadow-xl"
                aria-label="Leave feedback"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Send feedback</p>
            </TooltipContent>
          </Tooltip>

          {showFeedbackPopover && (
            <div className="bg-popover text-popover-foreground animate-in fade-in slide-in-from-bottom-2 absolute right-0 bottom-14 w-80 rounded-2xl border p-4 shadow-2xl duration-200">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-sm font-semibold">Send Feedback</h3>
                <Button
                  onClick={handleFeedbackClose}
                  variant="ghost"
                  size="icon-sm"
                  className="h-6 w-6 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your thoughts, report bugs, or suggest features..."
                  className="bg-background focus:ring-ring/50 focus:border-ring h-24 w-full resize-none rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  required
                />
                <Button type="submit" size="sm" className="w-full rounded-full">
                  Send Feedback
                </Button>
              </form>
            </div>
          )}
        </div>

        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                const { url, html } = extractContent();
                if (!webpageId) {
                  mutate({
                    body: {
                      url,
                      html,
                    },
                  });
                } else {
                  onToggle();
                }
              }}
              variant="default"
              size="icon-lg"
              className="border-border relative rounded-full border shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isExpanded ? (
                isPending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <ScanTextIcon className="size-5" />
                )
              ) : (
                <img
                  src={NotemindLogo}
                  alt="NoteMinds Logo"
                  className="size-8"
                />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Open Noteminds</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
