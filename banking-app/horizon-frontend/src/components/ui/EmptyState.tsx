import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center" }}>
      {Icon && (
        <div style={{ width: "4rem", height: "4rem", borderRadius: "9999px", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <Icon size={24} color="#2563eb" />
        </div>
      )}
      <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem", maxWidth: "300px" }}>{description}</p>
      {action && (
        <button onClick={action.onClick} style={{ backgroundColor: "#2563eb", color: "white", padding: "0.625rem 1.25rem", borderRadius: "0.5rem", border: "none", fontSize: "0.875rem", fontWeight: "500", cursor: "pointer" }}>
          {action.label}
        </button>
      )}
    </div>
  );
}