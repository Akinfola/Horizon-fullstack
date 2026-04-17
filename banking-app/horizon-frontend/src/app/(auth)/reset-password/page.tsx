"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, CheckCircle2, CheckCircle, XCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import AlertModal from "@/components/ui/AlertModal";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "At least one uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "At least one lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "At least one number", test: (p: string) => /[0-9]/.test(p) },
  { label: "At least one special character (!@#$...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword, isLoading } = useAuthStore();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const passedRules = passwordRules.filter(r => r.test(newPassword)).length;
  const allPasswordRulesPassed = passedRules === passwordRules.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setModal({
        show: true,
        type: "error",
        title: "Invalid Request",
        message: "The password reset token is missing. Please request a new link.",
      });
      return;
    }

    if (!allPasswordRulesPassed) {
      setModal({
        show: true,
        type: "error",
        title: "Weak Password",
        message: "Your password doesn't meet all requirements. It must have uppercase, lowercase, a number, a special character, and be at least 8 characters long.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setModal({
        show: true,
        type: "error",
        title: "Passwords Mismatch",
        message: "The passwords you entered do not match.",
      });
      return;
    }

    try {
      await resetPassword(token, { newPassword });
      setModal({
        show: true,
        type: "success",
        title: "Password Reset!",
        message: "Your password has been successfully updated. Redirecting to login...",
      });
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setModal({
        show: true,
        type: "error",
        title: "Reset Failed",
        message: err.message || "Something went wrong. The link may have expired.",
      });
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "1rem" }}>Invalid Link</h1>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>This password reset link is invalid or has expired.</p>
        <button 
          onClick={() => router.push("/forgot-password")}
          style={{ background: "#2563eb", color: "white", padding: "0.75rem 1.5rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}
        >
          Request new link
        </button>
      </div>
    );
  }

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
          Set new password
        </h1>
        <p style={{ color: "#6b7280" }}>Your new password must be different from previously used passwords.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.375rem" }}>
            New Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              placeholder="Enter at least 8 characters"
              required
              style={{ width: "100%", borderRadius: "0.5rem", border: "1px solid #d1d5db", backgroundColor: "white", padding: "0.75rem 2.5rem 0.75rem 1rem", fontSize: "0.875rem", color: "#111827", outline: "none", boxSizing: "border-box" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
 
          {/* Password Rules */}
          {(passwordFocused || newPassword.length > 0) && (
            <div style={{ marginTop: "0.75rem", padding: "0.875rem 1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
                Password requirements:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {passwordRules.map((rule) => {
                  const passed = rule.test(newPassword);
                  return (
                    <div key={rule.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {passed
                        ? <CheckCircle size={13} color="#16a34a" />
                        : <XCircle size={13} color="#d1d5db" />
                      }
                      <span style={{ fontSize: "0.75rem", color: passed ? "#16a34a" : "#6b7280" }}>
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.375rem" }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
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
          {isLoading ? "Updating..." : "Reset password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <Loader2 className="animate-spin" size={32} />
        </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
