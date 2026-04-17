"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import AlertModal from "@/components/ui/AlertModal";

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setModal({
        show: true,
        type: "error",
        title: "Missing Email",
        message: "Please enter your email address to receive a reset link.",
      });
      return;
    }

    try {
      await forgotPassword(email);
      setModal({
        show: true,
        type: "success",
        title: "Link Sent!",
        message: "If an account with that email exists, we have sent a password reset link to it.",
      });
      setEmail("");
    } catch (err: any) {
      setModal({
        show: true,
        type: "error",
        title: "Request Failed",
        message: err.message || "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "420px" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 2L30 9V23L16 30L2 23V9L16 2Z" fill="#2563EB" />
          <path d="M16 8L24 12V20L16 24L8 20V12L16 8Z" fill="white" fillOpacity="0.6" />
        </svg>
        <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>Horizon</span>
      </div>

      {/* Back to Login */}
      <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#6b7280", fontSize: "0.875rem", textDecoration: "none", marginBottom: "1.5rem", transition: "color 0.2s" }}>
        <ArrowLeft size={16} />
        Back to log in
      </Link>

      {/* Heading */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#111827", marginBottom: "0.5rem" }}>
          Forgot password?
        </h1>
        <p style={{ color: "#6b7280" }}>No worries, we'll send you reset instructions.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.375rem" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{ width: "100%", borderRadius: "0.5rem", border: "1px solid #d1d5db", backgroundColor: "white", padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#111827", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            background: isLoading ? "#93c5fd" : "#2563eb",
            color: "white",
            fontWeight: "600",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          {isLoading && <Loader2 className="animate-spin" size={16} />}
          {isLoading ? "Sending..." : "Reset password"}
        </button>
      </form>

      {/* Alert Modal */}
      {modal?.show && (
        <AlertModal
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(null)}
          autoClose={modal.type === "success"}
        />
      )}
    </div>
  );
}
