"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Country, State } from "country-state-city";
import { useAuthStore } from "@/store/authStore";
import AlertModal from "@/components/ui/AlertModal";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "At least one uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "At least one lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "At least one number", test: (p: string) => /[0-9]/.test(p) },
  { label: "At least one special character (!@#$...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const passedRules = passwordRules.filter(r => r.test(password)).length;
  const allPasswordRulesPassed = passedRules === passwordRules.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allPasswordRulesPassed) {
      setModal({
        show: true, type: "error",
        title: "Weak Password",
        message: "Your password doesn't meet all requirements. It must have uppercase, lowercase, a number, a special character and be at least 8 characters long.",
      });
      return;
    }

    const dateOfBirth = `${dobYear}-${dobMonth.padStart(2, "0")}-${dobDay.padStart(2, "0")}`;
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    if (age < 18) {
      setModal({
        show: true, type: "error",
        title: "Age Restriction",
        message: "You must be at least 18 years old to create a Horizon Banking account.",
      });
      return;
    }

    if (!dobDay || !dobMonth || !dobYear) {
      setModal({
        show: true, type: "error",
        title: "Incomplete DOB",
        message: "Please select your full date of birth.",
      });
      return;
    }

    try {
      await registerUser({ firstName, lastName, address, country, state, postalCode, dateOfBirth, email, password });
      setModal({
        show: true, type: "success",
        title: "Registration Successful! 📧",
        message: "Your account has been created. A verification link has been sent to your email. Redirecting to login...",
      });
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please check your details and try again.";

      if (msg.toLowerCase().includes("email already in use") || msg.toLowerCase().includes("email already")) {
        setModal({
          show: true, type: "error",
          title: "Email Already Registered",
          message: "This email address is already linked to an account. Please log in or use a different email.",
        });
      } else if (msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("already exists")) {
        setModal({
          show: true, type: "error",
          title: "Account Already Exists",
          message: "An account with these details already exists. Please try logging in instead.",
        });
      } else if (msg.toLowerCase().includes("network") || msg.toLowerCase().includes("connection")) {
        setModal({
          show: true, type: "error",
          title: "Connection Error",
          message: "We couldn't reach the server. Please check your internet connection and try again.",
        });
      } else {
        setModal({
          show: true, type: "error",
          title: "Registration Failed",
          message: msg,
        });
      }
    }
  };

  const handleAddressChange = (val: string) => {
    setAddress(val);

    // Clear previous timeout
    if (searchTimeout) clearTimeout(searchTimeout);

    if (val.length < 5) {
      setAddressSuggestions([]);
      return;
    }

    // Debounce the API call (wait 600ms after user stops typing)
    const timeout = setTimeout(async () => {
      setIsSearchingAddress(true);
      try {
        // Use Nominatim with an identification param (as per their policy)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=5&email=support@horizonbanking.com`
        );
        
        if (!res.ok) throw new Error("Network response was not ok");
        
        const data = await res.json();
        setAddressSuggestions(data);
      } catch (err) {
        console.warn("Address search failed:", err);
        setAddressSuggestions([]);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 600);

    setSearchTimeout(timeout);
  };

  const handleSelectAddress = (sug: any) => {
    const addr = sug.address;
    setAddress(sug.display_name);
    setAddressSuggestions([]);

    // Auto-fill postal code
    if (addr.postcode) setPostalCode(addr.postcode);

    // Auto-fill country if possible
    if (addr.country_code) {
      const countryCode = addr.country_code.toUpperCase();
      setCountry(countryCode);

      // Auto-fill state (matching the name)
      if (addr.state) {
        const states = State.getStatesOfCountry(countryCode);
        const match = states.find(s => s.name.toLowerCase().includes(addr.state.toLowerCase()));
        if (match) setState(match.name);
      }
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
    fontWeight: "500" as const,
    color: "#374151",
    marginBottom: "0.375rem",
  };

  const strengthColor =
    passedRules <= 2 ? "#ef4444" :
      passedRules <= 3 ? "#f59e0b" : "#16a34a";

  const strengthLabel =
    passedRules <= 2 ? "Weak" :
      passedRules <= 3 ? "Medium" : "Strong";

  return (
    <div style={{ width: "100%", maxWidth: "500px", paddingTop: "2rem", paddingBottom: "2rem" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 2L30 9V23L16 30L2 23V9L16 2Z" fill="#2563EB" />
          <path d="M16 8L24 12V20L16 24L8 20V12L16 8Z" fill="white" fillOpacity="0.6" />
        </svg>
        <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>Horizon</span>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#111827", marginBottom: "0.5rem" }}>Sign up</h1>
        <p style={{ color: "#6b7280" }}>Please enter your details.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* First & Last Name */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>First Name</label>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="ex: John" style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Last Name</label>
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="ex: Doe" style={inputStyle} required />
          </div>
        </div>

        {/* Nearest Landmark */}
        <div style={{ position: "relative" }}>
          <label style={labelStyle}>Nearest Landmark</label>
          <input
            type="text"
            value={address}
            onChange={e => handleAddressChange(e.target.value)}
            placeholder="e.g. Eiffel Tower, Mall of America, or your area name..."
            style={inputStyle}
            required
            autoComplete="off"
          />
          {isSearchingAddress && (
            <div style={{ position: "absolute", right: "0.75rem", top: "2.3rem" }}>
              <Loader2 size={16} className="animate-spin" color="#2563eb" />
            </div>
          )}

          {/* Suggestions Dropdown */}
          {addressSuggestions.length > 0 && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 50,
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              marginTop: "0.25rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              maxHeight: "200px",
              overflowY: "auto"
            }}>
              {addressSuggestions.map((sug, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectAddress(sug)}
                  style={{
                    padding: "0.75rem 1rem",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    borderBottom: i === addressSuggestions.length - 1 ? "none" : "1px solid #f3f4f6"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <p style={{ fontWeight: "500", color: "#111827", marginBottom: "0.125rem" }}>
                    {sug.address.road || sug.display_name.split(",")[0]}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {sug.display_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Country & State */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Country</label>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setState(""); // Reset state when country changes
              }}
              style={inputStyle}
              required
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>State / Province</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={inputStyle}
              disabled={!country}
              required
            >
              <option value="">Select State</option>
              {country && State.getStatesOfCountry(country).map((s) => (
                <option key={s.isoCode} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Postal Code */}
        <div>
          <label style={labelStyle}>Postal Code</label>
          <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="ex: 11101" style={inputStyle} required />
        </div>

        {/* Date of Birth */}
        <div>
          <label style={labelStyle}>Date of Birth</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr", gap: "0.75rem" }}>
            {/* Day */}
            <select value={dobDay} onChange={e => setDobDay(e.target.value)} style={inputStyle} required>
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            {/* Month */}
            <select value={dobMonth} onChange={e => setDobMonth(e.target.value)} style={inputStyle} required>
              <option value="">Month</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>

            {/* Year */}
            <select value={dobYear} onChange={e => setDobYear(e.target.value)} style={inputStyle} required>
              <option value="">Year</option>
              {Array.from({ length: 100 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" style={inputStyle} required />
        </div>

        {/* Password */}
        <div>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              placeholder="Enter your password"
              style={{ ...inputStyle, paddingRight: "2.5rem" }}
              required
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
          {(passwordFocused || password.length > 0) && (
            <div style={{ marginTop: "0.75rem", padding: "0.875rem 1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
                Password requirements:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {passwordRules.map((rule) => {
                  const passed = rule.test(password);
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

              {/* Strength bar */}
              {password.length > 0 && (
                <div style={{ marginTop: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Password strength</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: "600", color: strengthColor }}>
                      {strengthLabel}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        style={{
                          flex: 1, height: "4px", borderRadius: "9999px",
                          backgroundColor: level <= passedRules ? strengthColor : "#e5e7eb",
                          transition: "background-color 0.2s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            background: isLoading ? "#93c5fd" : "#2563eb",
            color: "white", fontWeight: "600",
            padding: "0.75rem 1rem", borderRadius: "0.5rem",
            border: "none", cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.5rem", fontSize: "0.875rem",
          }}
        >
          {isLoading && <Loader2 size={16} />}
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#2563eb", fontWeight: "500" }}>Login</Link>
      </p>

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