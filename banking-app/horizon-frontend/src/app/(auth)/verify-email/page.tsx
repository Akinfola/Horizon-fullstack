"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { authApi } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");

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
        setMessage("Your email has been verified successfully! You can now log in.");
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "";
        if (errorMsg.toLowerCase().includes("already verified")) {
          setStatus("success");
          setMessage("Your email is already verified. You can proceed to log in.");
        } else {
          setStatus("error");
          setMessage(errorMsg || "Verification failed. The link may have expired.");
        }
      }
    };

    verify();
  }, [token]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
        {status === "loading" && <Loader2 className="animate-spin" size={48} color="#2563eb" />}
        {status === "success" && <CheckCircle2 size={48} color="#16a34a" />}
        {status === "error" && <XCircle size={48} color="#dc2626" />}
      </div>

      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#111827" }}>
        {status === "loading" ? "Verifying..." : status === "success" ? "Verified!" : "Verification Failed"}
      </h1>

      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>{message}</p>

      {status !== "loading" && (
        <Link
          href="/login"
          style={{
            display: "inline-block", padding: "0.75rem 1.5rem", backgroundColor: "#2563eb",
            color: "white", borderRadius: "0.5rem", fontWeight: "600", textDecoration: "none"
          }}
        >
          Go to Login
        </Link>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" }}>
      <div style={{ backgroundColor: "white", padding: "3rem", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", maxWidth: "400px", width: "100%" }}>
        <Suspense fallback={<div style={{ textAlign: "center" }}><Loader2 className="animate-spin" size={48} color="#2563eb" /></div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
