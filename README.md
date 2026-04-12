# Horizon Banking 🏦

Horizon Banking is a modern, full-stack digital banking application designed to provide users with a seamless, secure, and intuitive financial management experience.

![Horizon Banking](https://via.placeholder.com/1000x500.png?text=Horizon+Banking)

## 🌟 Features

- **User Authentication:** Secure signup and login using JWT (JSON Web Tokens) with strict password requirements and duplicate email checks.
- **Account Dashboard:** A clean, responsive interface to view balances and quick stats.
- **Real-Time Data:** Powered by WebSockets (Socket.io) for instant updates.
- **Transactions & Transfers:** Send money and view transaction history seamlessly.
- **Cards Management:** Easily freeze/unfreeze cards.
- **Form validation & Error handling:** Robust feedback for users during form submissions.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** React 19
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) with persistent storage
- **Icons:** [Lucide React](https://lucide.dev/)
- **API Client:** Axios (with interceptors for auth cookies)

### Backend
- **Server:** Node.js with [Express.js](https://expressjs.com/)
- **Database:** PostgreSQL
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Real-Time Messaging:** Socket.io
- **Security:** bcryptjs for password hashing, cors, dotenv

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL running locally or a cloud database URL

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd horizon-banking
   ```

2. **Setup the Backend**
   ```bash
   cd banking-app/horizon-backend
   npm install
   ```
   - Create a `.env` file in the backend directory based on `.env.example`:
     ```env
     DATABASE_URL=postgresql://<user>:<password>@localhost:5432/horizonbank
     PORT=5000
     JWT_SECRET=your_super_secret_key
     CLIENT_URLS=http://localhost:3000
     JWT_EXPIRES_IN=7d
     ```
   - Run database migrations (or push schema):
     ```bash
     npm run db:push
     ```
   - Start the backend dev server:
     ```bash
     npm run dev
     ```

3. **Setup the Frontend**
   ```bash
   cd ../../banking-app/horizon-frontend
   npm install
   ```
   - Create a `.env.local` file in the frontend directory:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     ```
   - Start the frontend dev server:
     ```bash
     npm run dev
     ```

4. **View the App**
   Open your browser and navigate to `http://localhost:3000`

## 📂 Project Structure

```text
horizon-banking/
├── banking-app/
│   ├── horizon-backend/      # Express API, Drizzle schema, Sockets
│   │   ├── src/
│   │   │   ├── config/       # Database and Express config
│   │   │   ├── middlewares/  # Auth & Error handling
│   │   │   ├── modules/      # Domain logic (auth, accounts, transactions)
│   │   │   └── utils/        # Helpers (JWT generation, formatters)
│   │   └── ...
│   └── horizon-frontend/     # Next.js Application
│       ├── src/
│       │   ├── app/          # Next.js App Router pages & layouts
│       │   ├── components/   # Reusable UI components
│       │   ├── hooks/        # Custom React hooks
│       │   ├── lib/          # API config & utilities
│       │   ├── store/        # Zustand state stores
│       │   └── types/        # TypeScript definitions
│       └── ...
```

## 🔐 Security Checks & Best Practices

- JWTs are stored in HttpOnly/Secure cookies.
- Middleware restricts access to protected routes like `/dashboard` ensuring only authenticated users can enter.
- Typescript enforces strict typing across the full stack.

---
*Built to manage finances with ease. Access your accounts, transfer funds, and track your spending seamlessly.*
