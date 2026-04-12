export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "1rem" }}>
      <div style={{ width: "40px", height: "40px", border: "4px solid #e5e7eb", borderTopColor: "#2563eb", borderRadius: "9999px", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>{message}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}