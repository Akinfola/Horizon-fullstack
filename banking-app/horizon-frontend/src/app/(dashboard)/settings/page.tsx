"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { usersApi } from "@/lib/api";
import AlertModal from "@/components/ui/AlertModal";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user, fetchMe } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [address, setAddress] = useState(user?.address || "");
  const [state, setState] = useState(user?.state || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await usersApi.updateProfile({ firstName, lastName, address, state, postalCode });
      await fetchMe();
      setSuccess("Profile updated successfully! ✅");
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    backgroundColor: "white",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    color: "#111827",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.375rem",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "700px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>Settings</h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Manage your account settings and preferences</p>
      </div>

      {/* Profile Card */}
      <div style={{ backgroundColor: "white", borderRadius: "0.75rem", border: "1px solid #e5e7eb", padding: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ width: "4rem", height: "4rem", borderRadius: "9999px", backgroundColor: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold", color: "#2563eb" }}>
            {user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
          </div>
          <div>
            <h2 style={{ fontWeight: "600", color: "#111827" }}>{user?.firstName} {user?.lastName}</h2>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{user?.email}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* First & Last Name */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Email (read only) */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              value={user?.email || ""}
              readOnly
              style={{ ...inputStyle, backgroundColor: "#f9fafb", color: "#9ca3af", cursor: "not-allowed" }}
            />
          </div>

          {/* Address */}
          <div>
            <label style={labelStyle}>Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your address" style={inputStyle} />
          </div>

          {/* State & Postal */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>State</label>
              <input value={state} onChange={e => setState(e.target.value)} placeholder="ex: NY" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Postal Code</label>
              <input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="ex: 11101" style={inputStyle} />
            </div>
          </div>

          {/* Messages */}

          <button
            type="submit"
            disabled={loading}
            style={{ background: loading ? "#93c5fd" : "#2563eb", color: "white", fontWeight: "600", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.875rem" }}
          >
            {loading && <Loader2 size={16} />}
            Save Changes
          </button>
        </form>
      </div>

      {/* Alert Modals */}
      {error && (
        <AlertModal
          type="error"
          title="Update Failed"
          message={error}
          onClose={() => setError("")}
          autoClose={false}
        />
      )}
      {success && (
        <AlertModal
          type="success"
          title="Success"
          message={success}
          onClose={() => setSuccess("")}
          autoClose={true}
        />
      )}
    </div>
  );
}