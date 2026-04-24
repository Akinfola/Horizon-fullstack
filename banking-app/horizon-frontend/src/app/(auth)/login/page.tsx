"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import AlertModal from "@/components/ui/AlertModal";

export default function LoginPage() {
  const router = useRouter();
  const { login, resendVerification, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    buttonLabel?: string;
    resendEmail?: string;
  } | null>(null);

  const handleModalClose = async () => {
    const emailToResend = modal?.resendEmail;
    setModal(null);

    if (emailToResend) {
      try {
        await resendVerification(emailToResend);
        setModal({
          show: true,
          type: "success",
          title: "Link Sent! 📩",
          message: "A new verification link has been sent to your email. Please check your inbox (and spam folder).",
        });
      } catch (err: any) {
        setModal({
          show: true,
          type: "error",
          title: "Resend Failed",
          message: err.message || "Failed to resend verification link. Please try again later.",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setModal({
        show: true, type: "error",
        title: "Missing Details",
        message: "Please enter both your email address and password to continue.",
      });
      return;
    }

    try {
      await login(email, password);
      setModal({
        show: true, type: "success",
        title: "Welcome Back!",
        message: "You have successfully logged in. Redirecting you to your dashboard...",
      });
      setTimeout(() => router.push("/dashboard"), 2500);
    } catch (err: unknown) {
      const axiosErr = err as any;
      let errorMsg = axiosErr?.response?.data?.message || axiosErr?.message || "Invalid credentials. Please try again.";
      let errorTitle = "Login Failed";

      if (axiosErr?.response?.status === 423) {
        errorTitle = "Account Locked";
      }

      const isVerificationError = errorMsg.toLowerCase().includes("verify");

      setModal({
        show: true, type: "error",
        title: errorTitle,
        message: errorMsg,
        buttonLabel: isVerificationError ? "Verify" : undefined,
        resendEmail: isVerificationError ? email : undefined,
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

      {/* Heading */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#111827", marginBottom: "0.5rem" }}>
          Log in
        </h1>
        <p style={{ color: "#6b7280" }}>Welcome back! Please enter your details.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.375rem" }}>
            Email
          </label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email" required
            style={{ width: "100%", borderRadius: "0.5rem", border: "1px solid #d1d5db", backgroundColor: "white", padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#111827", outline: "none", boxSizing: "border-box" as const }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.375rem" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password" required
              style={{ width: "100%", borderRadius: "0.5rem", border: "1px solid #d1d5db", backgroundColor: "white", padding: "0.75rem 2.5rem 0.75rem 1rem", fontSize: "0.875rem", color: "#111827", outline: "none", boxSizing: "border-box" as const }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <Link href="/forgot-password" style={{ fontSize: "0.875rem", color: "#2563eb", fontWeight: "500", textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit" disabled={isLoading}
          style={{
            width: "100%", background: isLoading ? "#93c5fd" : "#2563eb",
            color: "white", fontWeight: "600", padding: "0.75rem 1rem",
            borderRadius: "0.5rem", border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.5rem", fontSize: "0.875rem",
          }}
        >
          {isLoading && <Loader2 size={16} />}
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" style={{ color: "#2563eb", fontWeight: "500" }}>Sign up</Link>
      </p>

      {/* Alert Modal */}
      {modal?.show && (
        <AlertModal
          type={modal.type}
          title={modal.title}
          message={modal.message}
          buttonLabel={modal.buttonLabel}
          onClose={handleModalClose}
          autoClose={modal.type === "success"}
        />
      )}
    </div>
  );
}