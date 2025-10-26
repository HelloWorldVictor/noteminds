# Noteminds

A smart reading assistant browser extension that helps students learn more effectively. Built for ALU students and beyond.

## Overview

Noteminds enhances your reading experience with AI-powered features:

- **Smart Summaries**: Get concise summaries of any webpage
- **Interactive Quizzes**: Test your understanding with auto-generated questions
- **Note Taking**: Take contextual notes while reading
- **Resource Management**: Extract and organize important links

## Project Structure

This is a Turborepo monorepo containing:

### Applications

#### `apps/extension`

Browser extension built with WXT and React 19.

- **Framework**: WXT (Web Extension Framework)
- **UI**: React with TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI + shadcn/ui

#### `apps/backend`

API server for AI features and data processing.

- **Runtime**: Bun
- **Framework**: Elysia
- **Language**: TypeScript

### Shared Packages

#### `packages/eslint-config`

Shared ESLint configurations for consistent code quality.

- Base config for Node.js/TypeScript
- React-specific config with hooks support
- Prettier integration

#### `packages/typescript-config`

Shared TypeScript configurations.

- Base config with strict type checking
- React-specific config
- Node.js-specific config

#### `packages/prettier-config`

Shared Prettier configuration for code formatting.

- Consistent formatting rules
- Tailwind CSS class sorting

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0
- Bun (for backend development)

### Installation

```bash
# Install dependencies
pnpm install

# Start all apps in development
pnpm dev

# Build all apps
pnpm build

# Format code
pnpm format

# Lint code
pnpm lint

# Type check
pnpm check-types
```

### Development

#### Extension Only

```bash
cd apps/extension
pnpm dev              # Chrome
pnpm dev:firefox      # Firefox
```

#### Backend Only

```bash
cd apps/backend
bun run dev
```

## Tech Stack

- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Languages**: TypeScript
- **Frontend**: React 19, Tailwind CSS v4
- **Backend**: Bun, Elysia
- **Extension**: WXT Framework
- **UI Components**: Radix UI, shadcn/ui
- **Code Quality**: ESLint, Prettier, TypeScript

## Project Features

### Code Quality

- Strict TypeScript configuration
- ESLint with modern flat config
- Prettier with Tailwind plugin
- Consistent formatting across all packages

### Development Experience

- Hot reload for all applications
- Shared configurations
- Type-safe development
- Fast builds with Turborepo caching

## Contributing

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Create a feature branch
4. Make your changes
5. Run tests and linting: `pnpm lint`
6. Submit a pull request

## License

MIT License - Built with ❤️ for ALU Students

## Links

- [Turborepo Documentation](https://turborepo.com/docs)
- [WXT Documentation](https://wxt.dev/)
- [Elysia Documentation](https://elysiajs.com/)
