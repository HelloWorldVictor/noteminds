# Noteminds Browser Extension

Smart reading assistant browser extension built with WXT and React.

## Features

- **Smart Summaries**: AI-powered content summarization
- **Study Tools**: Interactive quizzes and flashcards
- **Note Taking**: Contextual notes for any webpage
- **Resource Links**: Extract and organize important links
- **Cross-browser**: Works on Chrome, Firefox, and other browsers

## Tech Stack

- **Framework**: [WXT](https://wxt.dev/) - Next-gen web extension framework
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI primitives
- **Build**: Vite

## Development

```bash
# Install dependencies
pnpm install

# Start development server (Chrome)
pnpm dev

# Start development for Firefox
pnpm dev:firefox

# Build for production
pnpm build

# Type checking
pnpm compile
```

## Project Structure

```
src/
├── components/       # React components
│   ├── inc/         # Feature-specific components
│   └── ui/          # Reusable UI components (shadcn)
├── entrypoints/     # Extension entry points
│   ├── background.ts
│   ├── content/     # Content script
│   └── popup/       # Extension popup
├── hooks/           # Custom React hooks
├── lib/             # Utilities
└── styles/          # Global styles
```

## Loading in Browser

### Chrome/Edge

1. Run `pnpm build`
2. Open `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select `.output/chrome-mv3` directory

### Firefox

1. Run `pnpm build:firefox`
2. Open `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select any file in `.output/firefox-mv2` directory
