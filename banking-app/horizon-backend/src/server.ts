import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";

import { errorHandler } from "./middlewares/error.middleware";
import budgetRoutes from "./modules/budgets/budgets.routes";
import authRoutes from "./modules/auth/auth.routes";
import accountRoutes from "./modules/accounts/accounts.routes";
import transactionRoutes from "./modules/transactions/transactions.routes";
import transferRoutes from "./modules/transfers/transfers.routes";
import cardRoutes from "./modules/cards/cards.routes";
import loanRoutes from "./modules/loans/loans.routes";
import adminRoutes from "./modules/admin/admin.routes";

// Global rate limiter — 100 requests per 15 minutes per IP for all /api routes
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
    data: null,
  },
});

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map((url) => url.trim())
  : [

  ];

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  socket.on("joinRoom", (room: string) => {
    socket.join(room);
    console.log(`➡️ Socket ${socket.id} joined room ${room}`);
  });
});

app.set("io", io);

// FINAL: Working CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, mobile apps, server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ BLOCKED BY CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Security middleware
app.use(helmet());
app.use(cookieParser());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply global rate limiter to all API routes
app.use("/api", globalApiLimiter);

// Routes
app.use("/api/budgets", budgetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ message: "Horizon Banking API is running! 🚀" });
});

// Error handler
app.use(errorHandler);

// Start server
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port http://localhost:${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });

export default app;