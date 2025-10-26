# Noteminds Backend

API server for Noteminds browser extension built with Elysia and Bun.

## Features

- **Fast Runtime**: Powered by Bun for exceptional performance
- **Type-safe**: Built with TypeScript
- **Modern Framework**: Elysia for elegant API design
- **Auto-reload**: Watch mode for development

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Elysia](https://elysiajs.com/)
- **Language**: TypeScript

## Development

```bash
# Install dependencies
bun install

# Start development server with auto-reload
bun run dev

# Run without watch mode
bun run src/index.ts
```

The server will start at `http://localhost:3000/`

## API Endpoints

_(Document your endpoints here as you build them)_

```
GET  /health      - Health check
POST /summarize   - Generate content summary
POST /quiz        - Generate quiz questions
...
```

## Project Structure

```
src/
├── index.ts      # Main application entry
├── routes/       # API route handlers
├── services/     # Business logic
└── types/        # TypeScript type definitions
```

## Environment Variables

Create a `.env` file in the root:

```env
PORT=3000
API_KEY=your_api_key_here
```
