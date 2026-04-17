"use client";

import { useEffect, useState } from "react";
import { accountsApi, transfersApi } from "@/lib/api";
import { BankAccount } from "@/types";
import AlertModal from "@/components/ui/AlertModal";
import { Loader2 } from "lucide-react";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

import { getErrorMessage } from "@/utils/errorUtils";

export default function PaymentTransferPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [sourceBankId, setSourceBankId] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await accountsApi.getAll();
        setAccounts(res.data.data);
        if (res.data.data.length > 0) {
          setSourceBankId(res.data.data[0].id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsPageLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      await transfersApi.create({
        sourceBankId,
        recipientEmail,
        recipientAccountNumber,
        amount: parseFloat(amount),
        note,
      });
      setSuccess("Transfer successful! 🎉");
      setRecipientEmail("");
      setRecipientAccountNumber("");
      setAmount("");
      setNote("");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) return <LoadingSpinner message="Loading..." />;

  const inputStyle = {
    width: "100%",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    backgroundColor: "white",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    color: "#111827",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.375rem",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>Payment Transfer</h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
          Please provide any specific details or notes related to the payment transfer
        </p>
      </div>

      <form onSubmit={handleTransfer}>
        {/* Transfer Details */}
        <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e5e7eb", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "0.25rem" }}>Transfer details</h2>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>Enter the details of the recipient</p>

          {/* Source Bank */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={labelStyle}>Select Source Bank</label>
              <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.5rem" }}>
                Select the bank account you want to transfer funds from
              </p>
            </div>
            <div>
              <select
                value={sourceBankId}
                onChange={(e) => setSourceBankId(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                required
              >
                <option value="">Select Account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.bankName} - •••• {account.mask}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transfer Note */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <label style={labelStyle}>Transfer Note (Optional)</label>
              <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                Please provide any additional information or instructions related to the transfer
              </p>
            </div>
            <div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a short note here"
                rows={4}
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>
          </div>
        </div>

        {/* Bank Account Details */}
        <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e5e7eb", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "0.25rem" }}>Bank account details</h2>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>Enter the bank account details of the recipient</p>

          {/* Recipient Email */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={labelStyle}>Recipient&apos;s Email Address</label>
            </div>
            <div>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="ex: john@gmail.com"
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* Recipient Account Number */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={labelStyle}>Recipient&apos;s Bank Account Number</label>
            </div>
            <div>
              <input
                type="text"
                value={recipientAccountNumber}
                onChange={(e) => setRecipientAccountNumber(e.target.value)}
                placeholder="Enter the account number"
                style={inputStyle}
                required
              />
            </div>
          </div>

          {/* Amount */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <label style={labelStyle}>Amount</label>
            </div>
            <div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ex: 100"
                min="1"
                style={inputStyle}
                required
              />
            </div>
          </div>
        </div>

        {/* Messages */}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ width: "100%", background: isSubmitting ? "#93c5fd" : "#2563eb", color: "white", fontWeight: "600", padding: "0.875rem 1rem", borderRadius: "0.5rem", border: "none", cursor: isSubmitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.875rem" }}
        >
          {isSubmitting && <Loader2 size={16} />}
          Transfer Funds
        </button>
      </form>

      {/* Alert Modals */}
      {error && (
        <AlertModal
          type="error"
          title="Transfer Failed"
          message={error}
          onClose={() => setError("")}
          autoClose={false}
        />
      )}
      {success && (
        <AlertModal
          type="success"
          title="Transfer Successful"
          message={success}
          onClose={() => setSuccess("")}
          autoClose={true}
        />
      )}
    </div>
  );
}