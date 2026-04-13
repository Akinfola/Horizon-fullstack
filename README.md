# Horizon Banking App

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?logo=postgresql)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-Latest-1A1A1A)](https://orm.drizzle.team/)

Horizon is a full-stack banking platform built with a decoupled **Next.js** frontend and an **Express.js** backend. It implements authentication, account management, transactions, transfers, budgets, cards, loans, and administrative workflows — all with TypeScript across the stack.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Environment Variables](#environment-variables)
- [Local Development Setup](#local-development-setup)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This repository is a monorepo containing two independently deployable applications:

| App | Description |
|-----|-------------|
| `horizon-frontend/` | Customer-facing Next.js web application |
| `horizon-backend/` | Express.js REST API with real-time support |

---

## Architecture

### Frontend
Built with the Next.js App Router, structured around feature pages and reusable UI components:

- Authentication and protected routes
- Dashboard, account, and transaction views
- Transfer and budget management workflows
- Client-side state management with **Zustand**
- Form validation with **React Hook Form** + **Zod**

### Backend
Exposes a modular REST API with the following domain boundaries:

| Module | Responsibility |
|--------|----------------|
| `auth` | Registration, login, JWT issuance |
| `accounts` | Account creation and management |
| `transactions` | Transaction recording and history |
| `transfers` | Internal and external transfers |
| `budgets` | Budget planning and monitoring |
| `cards` | Card management |
| `loans` | Loan workflows |
| `admin` | Administrative operations |

Additional platform concerns:
- **Drizzle ORM** for type-safe PostgreSQL access
- **JWT** for authentication middleware
- **Socket.IO** for real-time communication
- **CORS** configuration for approved client origins
- Centralized error handling middleware

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js | React framework with App Router |
| React | UI rendering |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client |
| Zustand | Client-side state management |
| React Hook Form | Form handling |
| Zod | Schema validation |
| Recharts | Data visualisation |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| Express.js | HTTP server and routing |
| TypeScript | Type safety |
| PostgreSQL | Relational database |
| Drizzle ORM | Database access layer |
| JWT | Authentication tokens |
| Socket.IO | Real-time events |
| Zod | Input validation |
| bcryptjs | Password hashing |
| CORS | Cross-origin request handling |

---

## Repository Structure

```
banking-app/
├── horizon-backend/
│   ├── src/
│   │   ├── config/          # Environment and database config
│   │   ├── middlewares/     # Auth, error handling, CORS
│   │   ├── modules/         # Domain modules (auth, accounts, etc.)
│   │   └── utils/           # Shared utilities and helpers
│   ├── drizzle.config.ts
│   ├── nodemon.json
│   ├── tsconfig.json
│   └── package.json
│
├── horizon-frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages and layouts
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # API clients and utilities
│   │   ├── store/           # Zustand state stores
│   │   └── types/           # Shared TypeScript types
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

## Environment Variables

### Backend

Create a `.env` file in `horizon-backend/`:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/horizon
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URLS=http://localhost:3000
```

### Frontend

Create a `.env.local` file in `horizon-frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL (local or remote)

### 1. Clone the repository

```bash
git clone <repository-url>
cd banking-app
```

### 2. Install dependencies

```bash
# Backend
cd horizon-backend
npm install

# Frontend
cd ../horizon-frontend
npm install
```

### 3. Configure environment variables

Add the `.env` and `.env.local` files described in the [Environment Variables](#environment-variables) section.

### 4. Apply database schema

From `horizon-backend/`:

```bash
npm run db:migrate
```

### 5. Start the backend

```bash
cd horizon-backend
npm run dev
```

### 6. Start the frontend

```bash
cd horizon-frontend
npm run dev
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |

---

## Available Scripts

### Backend (`horizon-backend/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Nodemon |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run migrations and start the compiled server |
| `npm run db:generate` | Generate Drizzle schema artifacts |
| `npm run db:migrate` | Push schema changes to the database |
| `npm run db:studio` | Open Drizzle Studio |

### Frontend (`horizon-frontend/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build production assets |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## API Endpoints

All modules are mounted under `/api`:

| Endpoint | Methods |
|----------|---------|
| `/api/auth/*` | POST |
| `/api/accounts/*` | GET, POST |
| `/api/transactions/*` | GET, POST |
| `/api/transfers/*` | POST |
| `/api/budgets/*` | GET, POST |
| `/api/cards/*` | GET, POST |
| `/api/loans/*` | GET, POST |
| `/api/admin/*` | GET, POST |
| `/` | GET — health/status check |

---

## Deployment

### Backend

1. Set production values for `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URLS`, and `PORT`
2. Build the project:
   ```bash
   npm run build
   ```
3. Ensure database migrations are applied before startup
4. Deploy to your preferred hosting environment (e.g. Render, Railway, Fly.io)

### Frontend

1. Set `NEXT_PUBLIC_API_URL` to your deployed backend URL
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy to Vercel or any Next.js-compatible host

> **Note:** Update `CLIENT_URLS` in the backend to include your production frontend domain to allow CORS requests.

---

## Contributing

When extending the codebase:

- Isolate business logic within service layers
- Keep controllers thin and route-focused
- Validate all inputs using **Zod**
- Maintain consistent API response patterns
- Preserve TypeScript typing across module boundaries
- Avoid coupling UI state directly to transport-layer concerns

---

## License

This project is intended for internal or organizational use unless otherwise specified.
