"use client";

import { useEffect, useState } from "react";
import { accountsApi, transactionsApi } from "@/lib/api";
import { BankAccount, Transaction } from "@/types";
import AlertModal from "@/components/ui/AlertModal";
import { formatCurrency, formatDate, getStatusStyle, getCategoryStyle } from "@/lib/utils";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function TransactionHistoryPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await accountsApi.getAll();
        setAccounts(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedAccount(res.data.data[0]);
        }
      } catch (error) {
        setError("Failed to load accounts. Please try again.");
        console.error(error);
      } finally {
        // Enforce artificial 2-second delay for the visual loading animation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (!selectedAccount) return;
    const fetchTransactions = async () => {
      try {
        const res = await transactionsApi.getAll({
          accountId: selectedAccount.id,
          page,
          limit: 10,
        });
        setTransactions(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTransactions();
  }, [selectedAccount, page]);

  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>Transaction history</h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Gain Insights and Track Your Transactions Over Time</p>
        </div>
        {/* Account Selector */}
        <select
          onChange={(e) => {
            const account = accounts.find(a => a.id === e.target.value);
            if (account) setSelectedAccount(account);
          }}
          style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "1px solid #e5e7eb", fontSize: "0.875rem", color: "#374151", cursor: "pointer" }}
        >
          {accounts.map(account => (
            <option key={account.id} value={account.id}>{account.bankName}</option>
          ))}
        </select>
      </div>

      {/* Selected Account Card */}
      {selectedAccount && (
        <div style={{
          borderRadius: "0.75rem",
          padding: "1.5rem",
          marginBottom: "2rem",
          color: "white",
          background: selectedAccount.cardVariant === "blue"
            ? "linear-gradient(90deg, #0179FE 0%, #4893FF 100%)"
            : "linear-gradient(90deg, #5C08C4 0%, #8B5CF6 100%)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.25rem" }}>{selectedAccount.bankName}</h2>
            <p style={{ opacity: 0.8, fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              {selectedAccount.accountType.charAt(0).toUpperCase() + selectedAccount.accountType.slice(1)} Account
            </p>
            <p style={{ fontFamily: "monospace", fontSize: "0.875rem", letterSpacing: "0.1em" }}>
              •••• •••• •••• {selectedAccount.mask}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.75rem", opacity: 0.8, marginBottom: "0.25rem" }}>Current Balance</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {formatCurrency(selectedAccount.currentBalance)}
            </p>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e5e7eb" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827" }}>Transaction history</h2>
          <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", background: "white", fontSize: "0.875rem", cursor: "pointer", color: "#374151" }}>
            Apply filter
          </button>
        </div>

        {transactions.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
            No transactions found for this account
          </div>
        ) : (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                  {["Transaction", "Amount", "Status", "Date", "Category"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "500", color: "#6b7280" }}>{h}</th>
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
                          <div style={{ width: "2rem", height: "2rem", borderRadius: "9999px", backgroundColor: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "600", color: "#2563eb" }}>
                            {tx.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "#111827" }}>{tx.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ fontSize: "0.875rem", fontWeight: "600", color: isCredit ? "#16a34a" : "#ef4444" }}>
                          {isCredit ? "+" : "-"}{formatCurrency(Math.abs(Number(tx.amount)))}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", borderRadius: "9999px", padding: "0.125rem 0.625rem", fontSize: "0.75rem", fontWeight: "500", backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "9999px", backgroundColor: statusStyle.dot }} />
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", color: "#6b7280" }}>{formatDate(tx.date)}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", borderRadius: "9999px", border: "1px solid", padding: "0.125rem 0.625rem", fontSize: "0.75rem", fontWeight: "500", backgroundColor: categoryStyle.bg, color: categoryStyle.text }}>
                          {categoryStyle.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", background: "white", fontSize: "0.875rem", cursor: page === 1 ? "not-allowed" : "pointer", color: page === 1 ? "#9ca3af" : "#374151" }}
              >
                ← Previous
              </button>
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Page {page}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={transactions.length < 10}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", background: "white", fontSize: "0.875rem", cursor: transactions.length < 10 ? "not-allowed" : "pointer", color: transactions.length < 10 ? "#9ca3af" : "#374151" }}
              >
                Next →
              </button>
            </div>
          </>
        )}
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