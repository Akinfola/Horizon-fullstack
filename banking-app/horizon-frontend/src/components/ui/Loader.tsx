import React from "react";

export default function Loader() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @keyframes pulse-spin {
          0% { transform: scale(0.95) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.05) rotate(180deg); opacity: 1; filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.4)); }
          100% { transform: scale(0.95) rotate(360deg); opacity: 0.8; }
        }
        .horizon-spinner {
          animation: pulse-spin 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
      <svg className="horizon-spinner" width="48" height="48" viewBox="0 0 32 32" fill="none">
        <path d="M16 2L30 9V23L16 30L2 23V9L16 2Z" fill="#2563EB" />
        <path d="M16 8L24 12V20L16 24L8 20V12L16 8Z" fill="white" fillOpacity="0.6" />
      </svg>
    </div>
  );
}
