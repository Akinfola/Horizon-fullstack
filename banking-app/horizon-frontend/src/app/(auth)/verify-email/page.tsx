"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { authApi } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");
  const [countdown, setCountdown] = useState(3);
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been verified! Taking you to your dashboard...");
      } catch (err: any) {
        const errorMsg = (err.response?.data?.message || "").toLowerCase();
        if (errorMsg.includes("already verified") || errorMsg.includes("invalid or expired")) {
          // Token already used — treat as success, redirect to login since we can't auto-login
          setStatus("success");
          setMessage("Your email is already verified. Taking you to login...");
        } else {
          setStatus("error");
          setMessage(err.response?.data?.message || "Verification failed. The link may have expired.");
        }
      }
    };

    verify();
  }, [token]);

  // Auto-redirect after success
  useEffect(() => {
    if (status !== "success") return;
    if (countdown <= 0) {
      window.location.href = "/dashboard";
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, countdown]);

  const handleResend = async () => {
    if (!resendEmail) return;
    setResendStatus("sending");
    try {
      await authApi.resendVerification(resendEmail);
      setResendStatus("sent");
    } catch {
      setResendStatus("idle");
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

      {/* Status Icon */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{
          width: "5rem", height: "5rem", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor:
            status === "loading" ? "#eff6ff" :
            status === "success" ? "#f0fdf4" : "#fef2f2",
          transition: "background-color 0.3s ease",
        }}>
          {status === "loading" && <Loader2 size={40} color="#2563eb" className="animate-spin" />}
          {status === "success" && <CheckCircle2 size={40} color="#16a34a" />}
          {status === "error" && <XCircle size={40} color="#dc2626" />}
        </div>
      </div>

      {/* Heading */}
      <div style={{ marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#111827", marginBottom: "0.5rem" }}>
          {status === "loading" ? "Verifying..." :
           status === "success" ? "Email Verified!" :
           "Verification Failed"}
        </h1>
        <p style={{ color: "#6b7280", lineHeight: "1.6" }}>{message}</p>
      </div>

      {/* Countdown */}
      {status === "success" && (
        <div style={{
          backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: "0.75rem", padding: "0.875rem 1rem",
          marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem",
        }}>
          <CheckCircle2 size={16} color="#16a34a" />
          <p style={{ color: "#15803d", fontSize: "0.875rem", fontWeight: "500" }}>
            Redirecting in {countdown}s...
          </p>
        </div>
      )}

      {/* Error: Resend form */}
      {status === "error" && (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.875rem", color: "#374151", fontWeight: "500", marginBottom: "0.5rem" }}>
            Need a new link? Enter your email:
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={resendStatus === "sent"}
              style={{
                flex: 1, borderRadius: "0.5rem", border: "1px solid #d1d5db",
                padding: "0.625rem 0.875rem", fontSize: "0.875rem", color: "#111827", outline: "none",
                backgroundColor: resendStatus === "sent" ? "#f9fafb" : "white",
                boxSizing: "border-box" as const,
              }}
            />
            <button
              onClick={handleResend}
              disabled={!resendEmail || resendStatus !== "idle"}
              style={{
                padding: "0.625rem 1rem", borderRadius: "0.5rem", border: "none",
                backgroundColor: resendStatus === "sent" ? "#16a34a" : "#2563eb",
                color: "white", fontWeight: "600", fontSize: "0.875rem",
                cursor: !resendEmail || resendStatus !== "idle" ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: "0.375rem", whiteSpace: "nowrap" as const,
                opacity: !resendEmail || resendStatus === "sending" ? 0.7 : 1,
              }}
            >
              {resendStatus === "sending" && <Loader2 size={14} className="animate-spin" />}
              {resendStatus === "sent" && <CheckCircle2 size={14} />}
              {resendStatus === "idle" && <RefreshCw size={14} />}
              {resendStatus === "sent" ? "Sent!" : resendStatus === "sending" ? "Sending..." : "Resend"}
            </button>
          </div>
          {resendStatus === "sent" && (
            <p style={{ color: "#16a34a", fontSize: "0.8125rem", marginTop: "0.5rem" }}>
              ✓ A new verification link has been sent. Check your inbox.
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {status === "success" && (
          <button
            onClick={() => { window.location.href = "/dashboard"; }}
            style={{
              width: "100%", background: "#2563eb", color: "white",
              fontWeight: "600", padding: "0.75rem 1rem", borderRadius: "0.5rem",
              border: "none", cursor: "pointer", fontSize: "0.875rem",
            }}
          >
            Go to Dashboard
          </button>
        )}
        {status === "error" && (
          <Link
            href="/login"
            style={{
              display: "block", textAlign: "center", width: "100%",
              background: "#2563eb", color: "white", fontWeight: "600",
              padding: "0.75rem 1rem", borderRadius: "0.5rem",
              textDecoration: "none", fontSize: "0.875rem",
              boxSizing: "border-box" as const,
            }}
          >
            Back to Login
          </Link>
        )}
      </div>

      <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}>
        Need help?{" "}
        <a href="mailto:support@horizonbank.com" style={{ color: "#2563eb", fontWeight: "500" }}>
          Contact support
        </a>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <Loader2 size={48} color="#2563eb" className="animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
