// This file helps extract content from the current webpage.
// It clones the page and removes extension elements to get clean HTML.
export interface ExtractedContent {
  title: string;
  url: string;
  html: string;
}

/**
 * Extract raw HTML from the current page
 * Excludes the extension's own content script elements
 */
export function extractContent(): ExtractedContent {
  // Clone the document to avoid modifying the live DOM
  const docClone = document.cloneNode(true) as Document;

  // Remove the extension's shadow root container and related elements
  const extensionSelectors = [
    "[data-wxt-shadow-root]",
    '[id^="wxt-"]',
    '[class*="wxt-"]',
    "wxt-shadow-root",
    // Also remove any elements with our extension-specific attributes
    "[data-noteminds-ui]",
    '[id*="noteminds"]',
    '[class*="noteminds"]',
  ];

  extensionSelectors.forEach((selector) => {
    docClone.querySelectorAll(selector).forEach((el) => el.remove());
  });

  // Get the full HTML without our extension elements
  const rawHTML = docClone.documentElement.outerHTML;

  return {
    title: document.title,
    url: window.location.href,
    html: rawHTML,
  };
}
