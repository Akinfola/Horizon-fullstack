"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { accountsApi, transactionsApi } from "@/lib/api";
import { BankAccount, Transaction } from "@/types";
import AlertModal from "@/components/ui/AlertModal";
import { formatCurrency, formatDate, getStatusStyle, getCategoryStyle, cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [totalBalance, setTotalBalance] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Handle hydration to ensure store is loaded before rendering
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const balanceRes = await accountsApi.getTotalBalance();
        const accountsList = balanceRes.data.data.accounts;
        setTotalBalance(balanceRes.data.data.totalBalance);
        setAccounts(accountsList);
        if (accountsList.length > 0) {
          setSelectedAccountId(accountsList[0].id);
        }
      } catch (error) {
        setError("Failed to load dashboard data. Please try again.");
        console.error(error);
      } finally {
        // Enforce artificial 1.5-second delay for the visual loading animation
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLoading(false);
      }
    };
    fetchData();
  }, [isHydrated, user, router]);

  useEffect(() => {
    if (!selectedAccountId) return;
    const fetchTransactions = async () => {
      try {
        const res = await transactionsApi.getAll({ accountId: selectedAccountId, limit: 5 });
        setTransactions(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTransactions();
  }, [selectedAccountId]);

  if (!isHydrated || loading) return <LoadingSpinner message="Loading..." />;

  if (!user) return null; // Safety return while redirecting

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>
            Welcome, <span style={{ color: "#2563eb" }}>{user?.firstName}</span>
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            Access & manage your account and transactions efficiently.
          </p>
        </div>

        {/* Balance Card */}
        <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e5e7eb", padding: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {/* Donut Chart */}
            <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="30" fill="none"
                  stroke="#2563eb" strokeWidth="8"
                  strokeDasharray={`${accounts.length > 0 ? 150 : 0} 188`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                {accounts.length} Bank Account{accounts.length !== 1 ? "s" : ""}
              </p>
              <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.25rem" }}>Total Current Balance</p>
              <p style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#111827" }} className="text-2xl md:text-3xl">
                {formatCurrency(totalBalance)}
              </p>
            </div>
            <button
              onClick={() => router.push("/my-banks")}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#2563eb", fontSize: "0.875rem", fontWeight: "500", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              <Plus size={16} /> Add bank
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>Recent transactions</h2>
            <button
              onClick={() => router.push("/transaction-history")}
              style={{ fontSize: "0.875rem", color: "#374151", background: "none", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.375rem 0.75rem", cursor: "pointer" }}
            >
              View all
            </button>
          </div>

          {/* Account Tabs */}
          {accounts.length > 0 && (
            <div style={{ padding: "0 1.5rem", borderBottom: "1px solid #f3f4f6", display: "flex", gap: "1.5rem", overflowX: "auto" }} className="px-4 md:px-6">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccountId(account.id)}
                  style={{
                    padding: "0.75rem 0",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    background: "none",
                    border: "none",
                    borderBottom: selectedAccountId === account.id ? "2px solid #2563eb" : "2px solid transparent",
                    color: selectedAccountId === account.id ? "#2563eb" : "#6b7280",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {account.bankName}
                </button>
              ))}
            </div>
          )}

          {/* Selected Account Info */}
          {selectedAccount && (
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "9999px", background: "linear-gradient(90deg, #0179FE 0%, #4893FF 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "0.875rem", flexShrink: 0 }}>
                {selectedAccount.bankName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: "600", color: "#111827", fontSize: "0.875rem" }}>{selectedAccount.bankName}</p>
                <p style={{ color: "#2563eb", fontSize: "0.875rem" }}>{formatCurrency(selectedAccount.currentBalance)}</p>
              </div>
              <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#6b7280", backgroundColor: "#f3f4f6", padding: "0.25rem 0.75rem", borderRadius: "9999px" }}>
                {selectedAccount.accountType}
              </span>
            </div>
          )}

          {/* Transaction Table */}
          {transactions.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
              No transactions yet for this account
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                    {["Transaction", "Amount", "Status", "Date", "Category"].map((h) => (
                      <th key={h} style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "500", color: "#6b7280", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const statusStyle = getStatusStyle(tx.status);
                    const categoryStyle = getCategoryStyle(tx.category);
                    const isCredit = tx.type === "credit";
                    return (
                      <tr key={tx.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ width: "2rem", height: "2rem", borderRadius: "9999px", backgroundColor: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "600", color: "#2563eb", flexShrink: 0 }}>
                              {tx.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "#111827", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {tx.name.startsWith("Transfer from") ? "Received Transfer" : tx.name.startsWith("Transfer to") ? "Sent Transfer" : tx.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: "600", color: isCredit ? "#16a34a" : "#ef4444", whiteSpace: "nowrap" }}>
                          {isCredit ? "+" : "-"}{formatCurrency(Math.abs(Number(tx.amount)))}
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <span 
                            className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", statusStyle.bg, statusStyle.text)}
                          >
                            <span className={cn("h-1.5 w-1.5 rounded-full", statusStyle.dot)} />
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                        </td>
                        <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", color: "#6b7280", whiteSpace: "nowrap" }}>{formatDate(tx.date)}</td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <span 
                            className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", categoryStyle.bg, categoryStyle.text, categoryStyle.border)}
                          >
                            {categoryStyle.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Hide on mobile */}
      <div style={{ width: "300px", borderLeft: "1px solid #e5e7eb", padding: "2rem", overflowY: "auto", backgroundColor: "white", flexShrink: 0 }} className="hidden md:block md:w-80">
        {/* User Profile */}
        <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ width: "4rem", height: "4rem", borderRadius: "9999px", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", fontSize: "1.5rem" }}>
            👤
          </div>
          <h3 style={{ fontWeight: "600", color: "#111827" }}>{user?.firstName} {user?.lastName}</h3>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{user?.email}</p>
        </div>

        {/* My Banks */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: "600", color: "#111827" }}>My Banks</h3>
            <button
              onClick={() => router.push("/my-banks")}
              style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}
            >
              <Plus size={14} /> Add bank
            </button>
          </div>
          {accounts.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "#9ca3af", textAlign: "center", padding: "1rem" }}>No accounts yet</p>
          ) : (
            accounts.map((account, index) => (
              <div
                key={account.id}
                onClick={() => setSelectedAccountId(account.id)}
                style={{
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  marginBottom: "0.5rem",
                  color: "white",
                  cursor: "pointer",
                  background: index % 2 === 0
                    ? "linear-gradient(90deg, #0179FE 0%, #4893FF 100%)"
                    : "linear-gradient(90deg, #5C08C4 0%, #8B5CF6 100%)",
                  border: selectedAccountId === account.id ? "2px solid #111827" : "2px solid transparent",
                }}
              >
                <p style={{ fontWeight: "600", fontSize: "0.875rem" }}>{account.bankName}</p>
                <p style={{ fontSize: "0.75rem", opacity: 0.8, marginTop: "0.25rem" }}>
                  •••• •••• •••• {account.mask}
                </p>
                <p style={{ fontSize: "0.875rem", fontWeight: "600", marginTop: "0.5rem" }}>
                  {formatCurrency(account.currentBalance)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* My Budgets */}
        <div>
          <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "1rem" }}>My budgets</h3>
          {[
            { label: "Subscriptions", color: "#2563eb", spent: 75, limit: 100 },
            { label: "Food and booze", color: "#dc2626", spent: 80, limit: 200 },
            { label: "Savings", color: "#16a34a", spent: 50, limit: 100 },
          ].map((budget) => (
            <div key={budget.label} style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                <span style={{ fontSize: "0.875rem", color: "#374151" }}>{budget.label}</span>
                <span style={{ fontSize: "0.875rem", color: budget.color, fontWeight: "500" }}>
                  ${budget.limit - budget.spent} left
                </span>
              </div>
              <div style={{ height: "6px", backgroundColor: "#f3f4f6", borderRadius: "9999px" }}>
                <div style={{ height: "100%", width: `${(budget.spent / budget.limit) * 100}%`, backgroundColor: budget.color, borderRadius: "9999px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Modal */}
      {error && (
        <AlertModal
          type="error"
          title="Error"
          message={error}
          onClose={() => setError("")}
          autoClose={false}
        />
      )}
    </div>
  );
}