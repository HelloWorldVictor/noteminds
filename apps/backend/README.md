# Noteminds Backend API

AI-powered backend for the Noteminds browser extension. Transform web content into summaries, quizzes, flashcards, and curated resources using advanced AI processing.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (recommended) or npm

### 1. Clone & Install

```bash
# From the root of the noteminds project
cd apps/backend
pnpm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Database Setup

```bash
# Generate and apply database migrations
pnpm run db:generate
pnpm run db:migrate

# Optional: Open Drizzle Studio to explore the database
pnpm run db:studio
```

### 4. Start Development Server

```bash
pnpm run dev
```

The server will start at `http://localhost:4137`

## 🔧 Environment Configuration

Create a `.env` file with the following variables:

```env
# Better Auth - Generate a random secret
BETTER_AUTH_SECRET=your-super-secret-key-here
BETTER_AUTH_URL=http://localhost:4137

# Google OAuth (optional - for user authentication)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Database
DATABASE_URL=sqlite.db

# Server
PORT=4137
```

### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BETTER_AUTH_SECRET` | Secret key for authentication | ✅ |
| `BETTER_AUTH_URL` | Base URL for auth callbacks | ✅ |
| `DATABASE_URL` | SQLite database path | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ✅ |
| `PORT` | Server port (default: 4137) | ⚠️ Optional |

## 📚 API Documentation

Once running, visit:

- **API Docs**: <http://localhost:4137/docs> (Swagger UI)
- **Health Check**: <http://localhost:4137/health>
- **Database Studio**: Run `pnpm run db:studio`

## 🏗 Project Structure

```
src/
├── index.ts          # Application entry point
├── lib/              # Core utilities (auth, AI, services)
├── routes/           # API endpoints (webpage, summary, quiz, flashcard)
└── db/               # Database schema and migrations
```

## 🛠 Available Scripts

```bash
# Development
pnpm run dev              # Start with hot reload
pnpm run build            # Build for production
pnpm run start            # Start production server

# Database
pnpm run db:generate      # Generate new migration
pnpm run db:migrate       # Apply migrations
pnpm run db:push          # Push schema changes (dev only)
pnpm run db:studio        # Open Drizzle Studio

# Code Quality
pnpm run lint             # ESLint checks
pnpm run check-types      # TypeScript checks
```

## 📝 Development Notes

- Uses **Better Auth** for authentication (simpler than NextAuth.js)
- **Drizzle ORM** for type-safe database operations
- **Elysia** framework for fast, lightweight API development
- **Google Gemini** for AI content generation
- **SQLite** for development (easily replaceable with PostgreSQL)

## 🤝 Contributing

1. Follow the existing code structure
2. Run `pnpm run lint` and `pnpm run check-types` before committing
3. Update this README if you add new features
4. Test all endpoints using the Swagger UI at `/docs`
