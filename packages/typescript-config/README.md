# @noteminds/typescript-config

Shared TypeScript configurations for Noteminds monorepo.

## Configurations

### `base.json`

Base configuration with strict type checking and modern ES2022 features.

**Features:**

- Strict type checking enabled
- ES2022 target with DOM libraries
- Module resolution: NodeNext
- Isolated modules for faster builds

### `react-library.json`

Extends base config for React applications and libraries.

**Features:**

- All base features
- JSX support with new React JSX transform
- React-specific type checking

### `node.json`

Extends base config for Node.js backend services.

**Features:**

- All base features
- Node.js-specific module resolution
- ES2022 without DOM libraries

## Usage

In your `tsconfig.json`:

```json
{
  "extends": "@noteminds/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```
