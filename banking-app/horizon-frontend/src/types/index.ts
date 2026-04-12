export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  state?: string;
  postalCode?: string;
  dateOfBirth?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  currentBalance: string;
  availableBalance: string;
  accountType: "savings" | "checking" | "credit";
  cardHolder: string;
  expiryDate: string;
  cardVariant: "blue" | "purple";
  mask: string;
  shareableId: string;
  spendingThisMonth: string;
  spendingLimit: string;
  createdAt: string;
}

export type TransactionStatus = "success" | "processing" | "declined";
export type TransactionCategory =
  | "subscriptions"
  | "deposit"
  | "groceries"
  | "food_dining"
  | "income"
  | "transfer"
  | "entertainment"
  | "utilities"
  | "other";

export interface Transaction {
  id: string;
  name: string;
  amount: string;
  type: "debit" | "credit";
  status: TransactionStatus;
  category: TransactionCategory;
  image?: string;
  accountId: string;
  date: string;
}

export interface Loan {
  id: string;
  userId: string;
  amount: string;
  interestRate: string;
  termMonths: number;
  status: "pending" | "active" | "paid" | "rejected";
  monthlyPayment: string;
  remainingBalance: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Card {
  id: string;
  userId: string;
  accountId: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  network: "visa" | "mastercard";
  status: "active" | "frozen" | "cancelled";
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: string;
  spent: string;
  icon: string;
  color: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TotalBalance {
  totalBalance: number;
  accountCount: number;
  accounts: BankAccount[];
}