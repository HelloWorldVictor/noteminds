"use client";

import type React from "react";

import { useState } from "react";
import {
  Power,
  MessageSquare,
  X,
  ScanTextIcon,
  BrainCircuitIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function NotemindsButton({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(true);
  const [notificationCount] = useState(25);
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

  return (
    <div
      className="fixed bottom-8 right-8 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => !isAnyPopoverOpen && setIsExpanded(false)}
    >
      <div className="flex items-center gap-2">
        <div
          className={`relative transition-all duration-300 ease-out ${
            isExpanded
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-4 pointer-events-none"
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
                <Power className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Disable extension</p>
            </TooltipContent>
          </Tooltip>

          {showPowerPopover && (
            <div className="absolute bottom-14 right-0 w-64 p-4 bg-popover text-popover-foreground rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm">Disable Extension</h3>
                <Button
                  onClick={handlePowerClose}
                  variant="ghost"
                  size="icon-sm"
                  className="h-6 w-6 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
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
          className={`relative transition-all duration-300 ease-out delay-75 ${
            isExpanded
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-4 pointer-events-none"
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
                <MessageSquare className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Send feedback</p>
            </TooltipContent>
          </Tooltip>

          {showFeedbackPopover && (
            <div className="absolute bottom-14 right-0 w-80 p-4 bg-popover text-popover-foreground rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-sm">Send Feedback</h3>
                <Button
                  onClick={handleFeedbackClose}
                  variant="ghost"
                  size="icon-sm"
                  className="h-6 w-6 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your thoughts, report bugs, or suggest features..."
                  className="w-full h-24 px-3 py-2 text-sm bg-background border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
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
              onClick={onToggle}
              variant="default"
              size="icon-lg"
              className="relative rounded-full shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isExpanded ? (
                <ScanTextIcon className="w-5 h-5" />
              ) : (
                <BrainCircuitIcon className="w-5 h-5" />
              )}

              {/* Notification Badge */}
              {notificationCount > 0 && !isExpanded && (
                <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1.5 bg-blue-600 rounded-full">
                  <span className="text-[10px] font-bold text-white">
                    {notificationCount}
                  </span>
                </div>
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
