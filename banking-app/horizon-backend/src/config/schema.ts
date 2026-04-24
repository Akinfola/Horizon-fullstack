import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const accountTypeEnum = pgEnum("account_type", ["savings", "checking", "credit"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["success", "processing", "declined"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["debit", "credit"]);
export const categoryEnum = pgEnum("category", [
  "subscriptions", "deposit", "groceries",
  "food_dining", "income", "transfer",
  "entertainment", "utilities", "other",
]);
export const cardVariantEnum = pgEnum("card_variant", ["blue", "purple"]);
export const cardNetworkEnum = pgEnum("card_network", ["visa", "mastercard"]);
export const cardStatusEnum = pgEnum("card_status", ["active", "frozen", "cancelled"]);
export const loanStatusEnum = pgEnum("loan_status", ["pending", "active", "paid", "rejected"]);
export const auditActionEnum = pgEnum("audit_action", [
  "LOGIN_SUCCESS", "LOGIN_FAILED", "LOGOUT",
  "REGISTER", "VERIFY_EMAIL",
  "PASSWORD_RESET_REQUEST", "PASSWORD_RESET_SUCCESS",
  "ACCOUNT_LOCKED",
  "TRANSFER_CREATED",
  "CARD_FROZEN", "CARD_UNFROZEN",
  "USER_PROFILE_UPDATED"
]);

// ─── Users ───────────────────────────────────────────────
export const users = pgTable("users", {
  id:          uuid("id").primaryKey().defaultRandom(),
  firstName:   varchar("first_name", { length: 100 }).notNull(),
  lastName:    varchar("last_name", { length: 100 }).notNull(),
  email:       varchar("email", { length: 255 }).notNull().unique(),
  password:    varchar("password", { length: 255 }).notNull(),
  address:     text("address"),
  state:       varchar("state", { length: 100 }),
  postalCode:  varchar("postal_code", { length: 20 }),
  dateOfBirth: varchar("date_of_birth", { length: 20 }),
  ssn:         varchar("ssn", { length: 4 }).unique(),
  role:        userRoleEnum("role").default("user").notNull(),
  isVerified:          boolean("is_verified").default(false).notNull(),
  verificationToken:   varchar("verification_token", { length: 255 }),
  verificationTokenExpiry: timestamp("verification_token_expiry", { withTimezone: true }),
  resetPasswordToken:  varchar("reset_password_token", { length: 255 }),
  resetPasswordExpiry: timestamp("reset_password_expiry", { withTimezone: true }),
  failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
  lockedUntil:         timestamp("locked_until", { withTimezone: true }),
  createdAt:   timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:   timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Bank Accounts ────────────────────────────────────────
export const accounts = pgTable("accounts", {
  id:                uuid("id").primaryKey().defaultRandom(),
  userId:            uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  bankName:          varchar("bank_name", { length: 100 }).notNull(),
  accountNumber:     varchar("account_number", { length: 20 }).notNull().unique(),
  currentBalance:    numeric("current_balance", { precision: 15, scale: 2 }).default("0").notNull(),
  availableBalance:  numeric("available_balance", { precision: 15, scale: 2 }).default("0").notNull(),
  accountType:       accountTypeEnum("account_type").default("savings").notNull(),
  cardHolder:        varchar("card_holder", { length: 200 }).notNull(),
  expiryDate:        varchar("expiry_date", { length: 7 }).notNull(),
  cardVariant:       cardVariantEnum("card_variant").default("blue").notNull(),
  mask:              varchar("mask", { length: 4 }).notNull(),
  shareableId:       uuid("shareable_id").defaultRandom().notNull(),
  spendingThisMonth: numeric("spending_this_month", { precision: 15, scale: 2 }).default("0").notNull(),
  spendingLimit:     numeric("spending_limit", { precision: 15, scale: 2 }).default("5000").notNull(),
  createdAt:         timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Transactions ─────────────────────────────────────────
export const transactions = pgTable("transactions", {
  id:             uuid("id").primaryKey().defaultRandom(),
  name:           varchar("name", { length: 200 }).notNull(),
  amount:         numeric("amount", { precision: 15, scale: 2 }).notNull(),
  type:           transactionTypeEnum("type").notNull(),
  status:         transactionStatusEnum("status").default("processing").notNull(),
  category:       categoryEnum("category").default("other").notNull(),
  image:          text("image"),
  accountId:      uuid("account_id").references(() => accounts.id, { onDelete: "cascade" }).notNull(),
  senderBankId:   uuid("sender_bank_id"),
  receiverBankId: uuid("receiver_bank_id"),
  date:           timestamp("date", { withTimezone: true }).defaultNow().notNull(),
  createdAt:      timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Cards ────────────────────────────────────────────────
export const cards = pgTable("cards", {
  id:         uuid("id").primaryKey().defaultRandom(),
  userId:     uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  accountId:  uuid("account_id").references(() => accounts.id, { onDelete: "cascade" }).notNull(),
  cardNumber: varchar("card_number", { length: 20 }).notNull().unique(),
  cardHolder: varchar("card_holder", { length: 200 }).notNull(),
  expiryDate: varchar("expiry_date", { length: 7 }).notNull(),
  cvv:        varchar("cvv", { length: 4 }).notNull(),
  network:    cardNetworkEnum("network").default("mastercard").notNull(),
  status:     cardStatusEnum("status").default("active").notNull(),
  createdAt:  timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Loans ────────────────────────────────────────────────
export const loans = pgTable("loans", {
  id:               uuid("id").primaryKey().defaultRandom(),
  userId:           uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  amount:           numeric("amount", { precision: 15, scale: 2 }).notNull(),
  interestRate:     numeric("interest_rate", { precision: 5, scale: 2 }).default("5.0").notNull(),
  termMonths:       integer("term_months").notNull(),
  status:           loanStatusEnum("status").default("pending").notNull(),
  monthlyPayment:   numeric("monthly_payment", { precision: 15, scale: 2 }).notNull(),
  remainingBalance: numeric("remaining_balance", { precision: 15, scale: 2 }).notNull(),
  startDate:        timestamp("start_date", { withTimezone: true }),
  endDate:          timestamp("end_date", { withTimezone: true }),
  createdAt:        timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Budgets ──────────────────────────────────────────────
export const budgets = pgTable("budgets", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  category:  categoryEnum("category").notNull(),
  limit:     numeric("limit", { precision: 15, scale: 2 }).notNull(),
  spent:     numeric("spent", { precision: 15, scale: 2 }).default("0").notNull(),
  icon:      varchar("icon", { length: 50 }),
  color:     varchar("color", { length: 20 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
 
// ─── Audit Logs ───────────────────────────────────────────
export const auditLogs = pgTable("audit_logs", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action:    auditActionEnum("action").notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId:   uuid("entity_id"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  metadata:  text("metadata"), // Stringified JSON or just text context
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});