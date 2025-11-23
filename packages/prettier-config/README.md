# @noteminds/prettier-config

Shared Prettier configuration for Noteminds monorepo.

## Features

- Consistent code formatting across all packages
- Tailwind CSS class sorting via plugin
- Standard settings for line width, quotes, and semicolons

## Usage

In your package's `package.json`:

```json
{
  "prettier": "@noteminds/prettier-config"
}
```

Or create a `prettier.config.js`:

```js
export { default } from "@noteminds/prettier-config";
```

## Configuration

- **Print Width**: 80 characters
- **Tab Width**: 2 spaces
- **Semicolons**: Required
- **Quotes**: Double quotes
- **Trailing Commas**: ES5 compatible
- **Arrow Function Parens**: Always included
- **End of Line**: LF (Unix style)
