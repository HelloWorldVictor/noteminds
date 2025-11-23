# @noteminds/eslint-config

Shared ESLint configurations for Noteminds monorepo.

## Configurations

### `base`

Base ESLint configuration for all JavaScript/TypeScript projects.

**Features:**

- ESLint recommended rules
- TypeScript ESLint integration
- Prettier compatibility
- Turbo monorepo support
- All errors shown as warnings for better DX

### `react-internal`

Configuration for React applications and libraries.

**Features:**

- All base features
- React and React Hooks linting
- Browser and Service Worker globals
- Modern JSX transform support

## Usage

Create `eslint.config.js` in your package:

### For Node.js/Backend projects

```js
import { config } from "@noteminds/eslint-config/base";

export default [...config];
```

### For React projects

```js
import { config } from "@noteminds/eslint-config/react-internal";

export default [...config];
```

## Custom Rules

Override rules by adding configuration objects:

```js
import { config } from "@noteminds/eslint-config/react-internal";

export default [
  ...config,
  {
    rules: {
      "no-console": "warn",
    },
  },
];
```
