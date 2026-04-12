import Loader from "./Loader";

export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  const hasDots = message?.endsWith("...");
  const baseMessage = hasDots ? message.replace(/\.\.\.$/, "") : message;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "1rem" }}>
      <Loader />
      {message && (
        <p style={{ color: "#6b7280", fontSize: "0.875rem", display: "flex", alignItems: "baseline" }}>
          {baseMessage}
          {hasDots && (
            <span className="jumping-dots" style={{ display: "inline-flex", marginLeft: "1px" }}>
              <span>.</span><span>.</span><span>.</span>
            </span>
          )}
        </p>
      )}
      <style>{`
        @keyframes dot-fade {
          0% { opacity: 0; }
          40% { opacity: 1; }
          100% { opacity: 0; }
        }
        .jumping-dots span {
          animation: dot-fade 1.5s infinite both;
          letter-spacing: 1px;
        }
        .jumping-dots span:nth-child(1) { animation-delay: 0s; }
        .jumping-dots span:nth-child(2) { animation-delay: 0.3s; }
        .jumping-dots span:nth-child(3) { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
}