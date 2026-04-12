"use client";

import { useEffect, useState } from "react";
import { accountsApi } from "@/lib/api";
import { BankAccount } from "@/types";
import AlertModal from "@/components/ui/AlertModal";
import { formatCurrency } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function MyBanksPage() {
  const { user } = useAuthStore();
  const userName = user ? `${user.firstName} ${user.lastName}`.toUpperCase() : "ADRIAN HAJDIN";
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await accountsApi.getAll();
        if (res.data.data && res.data.data.length > 0) {
          setAccounts(res.data.data);
        } else {
          // Fallback to screenshot mock data when database is empty
          setAccounts([
            {
              id: "mock1", bankName: "Chase Bank",
              accountNumber: "1234567890129191", cardHolder: userName,
              expiryDate: "06/24", mask: "9191", cardVariant: "blue",
              spendingThisMonth: "0.00", spendingLimit: "5000",
            } as any,
            {
              id: "mock2", bankName: "Bank of America",
              accountNumber: "1234567890128282", cardHolder: userName,
              expiryDate: "06/25", mask: "8282", cardVariant: "purple",
              spendingThisMonth: "0.00", spendingLimit: "5000",
            } as any
          ]);
        }
      } catch (err: unknown) {
        let errorMsg = "Failed to load bank accounts. Please try again.";
        if (err && typeof err === "object" && "response" in err) {
          const axiosErr = err as { response?: { data?: { message?: string } } };
          if (axiosErr.response?.data?.message) {
            errorMsg = axiosErr.response.data.message;
          }
        } else if (err instanceof Error) {
          errorMsg = err.message;
        }

        setError(errorMsg);
        console.error("My Banks Error:", err);
      } finally {
        // Enforce artificial 2-second delay for the visual loading animation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>
          My Bank Accounts
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
          Effortlessly Manage Your Banking Activities
        </p>
      </div>

      {/* Cards Grid */}
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "1rem" }}>
          Your cards
        </h2>

        {accounts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#9ca3af" }}>
            No bank accounts yet. Add one to get started!
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {accounts.map((account) => (
              <div key={account.id}>
                {/* Card */}
                <div
                  style={{
                    borderRadius: "1rem",
                    padding: "1.25rem",
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                    background: account.cardVariant === "blue"
                      ? "linear-gradient(90deg, #0179FE 0%, #4893FF 100%)"
                      : "linear-gradient(90deg, #5C08C4 0%, #8B5CF6 100%)",
                    marginBottom: "0.75rem",
                    boxShadow: "8px 10px 16px 0px rgba(0,0,0,0.18)",
                  }}
                >
                  {/* Decorative circles */}
                  <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.1)" }} />
                  <div style={{ position: "absolute", top: "20px", right: "20px", width: "80px", height: "80px", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.1)" }} />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Top row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                      <span style={{ fontWeight: "bold", fontSize: "1rem" }}>{account.bankName}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(account.accountNumber)}
                        style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "0.375rem", padding: "0.25rem", cursor: "pointer", color: "white" }}
                      >
                        <Copy size={13} />
                      </button>
                    </div>

                    {/* Card holder & expiry */}
                    <div style={{ marginBottom: "0.5rem" }}>
                      <p style={{ fontSize: "0.75rem", opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {account.cardHolder}
                        <span style={{ marginLeft: "1rem", opacity: 0.6 }}>{account.expiryDate}</span>
                      </p>
                    </div>

                    {/* Card number */}
                    <p style={{ fontFamily: "monospace", fontSize: "0.875rem", letterSpacing: "0.1em" }}>
                      •••• •••• •••• {account.mask}
                    </p>

                    {/* Mastercard logo */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                      <div style={{ display: "flex" }}>
                        <div style={{ width: "1.5rem", height: "1.5rem", borderRadius: "9999px", backgroundColor: "#ef4444", opacity: 0.9 }} />
                        <div style={{ width: "1.5rem", height: "1.5rem", borderRadius: "9999px", backgroundColor: "#f59e0b", opacity: 0.9, marginLeft: "-0.5rem" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spending info */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Spending this month</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#111827" }}>
                      {formatCurrency(account.spendingThisMonth)}
                    </span>
                  </div>
                  <div style={{ height: "6px", backgroundColor: "#e5e7eb", borderRadius: "9999px" }}>
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "9999px",
                        backgroundColor: account.cardVariant === "blue" ? "#2563eb" : "#7c3aed",
                        width: `${Math.min((Number(account.spendingThisMonth) / Number(account.spendingLimit)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
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