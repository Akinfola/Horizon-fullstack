"use client";
import { useEffect, useState } from "react";

interface AlertModalProps {
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
}

export default function AlertModal({ type, title, message, onClose, autoClose = true }: AlertModalProps) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    if (autoClose) {
      const t = setTimeout(() => handleClose(), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClose = () => { setLeaving(true); setTimeout(() => onClose(), 400); };
  const isSuccess = type === "success";

  return (
    <>
      <style>{`
        @keyframes scaleIn { 0% { transform: scale(0) rotate(-180deg); opacity: 0; } 60% { transform: scale(1.2) rotate(10deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
        @keyframes checkDraw { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }
        @keyframes fadeSlideIn { 0% { opacity: 0; transform: translate(-50%,-60%) scale(0.95); } 100% { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        @keyframes fadeSlideOut { 0% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 100% { opacity: 0; transform: translate(-50%,-60%) scale(0.95); } }
        @keyframes overlayIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes overlayOut { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes progressBar { 0% { width: 100%; } 100% { width: 0%; } }
        @keyframes ripple { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }
      `}</style>
      <div onClick={handleClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, animation: leaving ? "overlayOut 0.4s ease forwards" : "overlayIn 0.3s ease forwards" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 101, width: "100%", maxWidth: "400px", padding: "0 1rem", animation: leaving ? "fadeSlideOut 0.4s ease forwards" : "fadeSlideIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards" }}>
        <div style={{ backgroundColor: "white", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
          <div style={{ height: "6px", backgroundColor: isSuccess ? "#16a34a" : "#dc2626" }} />
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "9999px", backgroundColor: isSuccess ? "#f0fdf4" : "#fef2f2", margin: "0 auto 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", animation: visible ? "scaleIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards" : "none" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "9999px", border: `3px solid ${isSuccess ? "#16a34a" : "#dc2626"}`, animation: visible ? "ripple 1s ease-out 0.3s forwards" : "none", opacity: 0 }} />
              {isSuccess ? (
                <svg width="40" height="40" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="22" fill="none" stroke="#16a34a" strokeWidth="3" />
                  <polyline points="13,26 21,34 37,18" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100" strokeDashoffset="100" style={{ animation: visible ? "checkDraw 0.4s ease 0.5s forwards" : "none" }} />
                </svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="22" fill="none" stroke="#dc2626" strokeWidth="3" />
                  <line x1="16" y1="16" x2="34" y2="34" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" style={{ animation: visible ? "checkDraw 0.3s ease 0.4s forwards" : "none" }} />
                  <line x1="34" y1="16" x2="16" y2="34" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" style={{ animation: visible ? "checkDraw 0.3s ease 0.6s forwards" : "none" }} />
                </svg>
              )}
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: isSuccess ? "#14532d" : "#7f1d1d", marginBottom: "0.5rem" }}>{title}</h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: "1.6", marginBottom: "1.5rem" }}>{message}</p>
            <button onClick={handleClose} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "none", backgroundColor: isSuccess ? "#16a34a" : "#dc2626", color: "white", fontSize: "0.875rem", fontWeight: "600", cursor: "pointer" }}>
              {isSuccess ? "Continue" : "Try Again"}
            </button>
          </div>
          {autoClose && (
            <div style={{ height: "3px", backgroundColor: "#f3f4f6" }}>
              <div style={{ height: "100%", backgroundColor: isSuccess ? "#16a34a" : "#dc2626", animation: visible ? "progressBar 4s linear forwards" : "none" }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}