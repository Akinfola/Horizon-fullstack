"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, DollarSign, History, ArrowLeftRight, CreditCard, LogOut, Search, Menu, X, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "My Banks", href: "/my-banks", icon: DollarSign },
  { label: "Transaction History", href: "/transaction-history", icon: History },
  { label: "Payment Transfer", href: "/payment-transfer", icon: ArrowLeftRight },
  { label: "Connect Bank", href: "/settings", icon: CreditCard },
  { label: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => { 
    await logout(); 
    window.location.href = "/login"; 
  };

  const navContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "1.5rem 1rem", paddingBottom: "2.5rem" }}>
      {/* Logo Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <Link href="/dashboard" onClick={() => setIsOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L30 9V23L16 30L2 23V9L16 2Z" fill="#2563EB" />
            <path d="M16 8L24 12V20L16 24L8 20V12L16 8Z" fill="white" fillOpacity="0.6" />
          </svg>
          <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827" }}>Horizon</span>
        </Link>
        {/* Close button — only visible on mobile */}
        <button
          onClick={() => setIsOpen(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "0.25rem" }}
          className="mobile-close-btn"
        >
          <X size={22} />
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <Search size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
        <input
          type="text"
          placeholder="Search"
          style={{ width: "100%", borderRadius: "0.5rem", border: "1px solid #e5e7eb", backgroundColor: "#f9fafb", paddingLeft: "2.25rem", paddingRight: "1rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" as const }}
        />
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "0.5rem", textDecoration: "none", fontSize: "0.875rem", fontWeight: "500", backgroundColor: isActive ? "#2563eb" : "transparent", color: isActive ? "white" : "#4b5563", transition: "background-color 0.15s" }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
          <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "9999px", backgroundColor: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", fontWeight: "600", fontSize: "0.875rem", flexShrink: 0 }}>
            {user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </p>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", flexShrink: 0, marginLeft: "0.5rem" }}>
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        /* ── Desktop Sidebar ── */
        .sidebar-desktop {
          width: 264px;
          min-height: 100vh;
          background: white;
          border-right: 1px solid #f3f4f6;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        /* ── Mobile: hide desktop sidebar, show hamburger ── */
        .hamburger-btn { display: none; }
        .sidebar-mobile { display: none; }
        .sidebar-overlay { display: none; }
        .mobile-close-btn { display: none; }

        @media (max-width: 768px) {
          /* Hide desktop sidebar */
          .sidebar-desktop { display: none !important; }

          /* Show hamburger button */
          .hamburger-btn {
            display: flex !important;
            position: fixed;
            top: 0.875rem;
            left: 0.875rem;
            z-index: 60;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 0.5rem;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            align-items: center;
            justify-content: center;
          }

          /* Show mobile sidebar */
          .sidebar-mobile {
            display: block !important;
            position: fixed;
            top: 0;
            left: 0;
            height: 100dvh;
            width: 280px;
            background: white;
            box-shadow: 4px 0 24px rgba(0,0,0,0.12);
            z-index: 70;
            overflow-y: auto;
            transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          }

          /* Dark overlay behind sidebar */
          .sidebar-overlay {
            display: block !important;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 65;
            backdrop-filter: blur(2px);
          }

          /* Show close button inside mobile sidebar */
          .mobile-close-btn { display: block !important; }
        }
      `}</style>

      {/* ── Hamburger Button (mobile only) ── */}
      <button
        className="hamburger-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} color="#374151" />
      </button>

      {/* ── Overlay (mobile only) ── */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar ── */}
      <div
        className="sidebar-mobile"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        {navContent}
      </div>

      {/* ── Desktop Sidebar ── */}
      <aside className="sidebar-desktop">
        {navContent}
      </aside>
    </>
  );
}