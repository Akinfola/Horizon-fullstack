import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TransactionCategory, TransactionStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function maskAccountNumber(accountNumber: string): string {
  const last4 = accountNumber.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusStyle(status: TransactionStatus) {
  const map = {
    success: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    processing: { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
    declined: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  };
  return map[status];
}

export function getCategoryStyle(category: TransactionCategory) {
  const map = {
    subscriptions: { label: "Subscriptions", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    deposit: { label: "Deposit", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    groceries: { label: "Groceries", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    food_dining: { label: "Food & Dining", bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
    income: { label: "Income", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
    transfer: { label: "Transfer", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
    entertainment: { label: "Entertainment", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    utilities: { label: "Utilities", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    other: { label: "Other", bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
  };
  return map[category];
}