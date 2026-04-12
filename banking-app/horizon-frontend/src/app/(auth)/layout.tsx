export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full">
      <section className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        {children}
      </section>
      <aside
        className="hidden xl:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
        }}
      >
        <div className="relative z-10 text-center text-white px-12">
          <div className="mb-8 flex justify-center">
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                borderRadius: "1rem",
                padding: "1rem",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L30 9V23L16 30L2 23V9L16 2Z" fill="white" fillOpacity="0.9" />
                <path d="M16 8L24 12V20L16 24L8 20V12L16 8Z" fill="white" fillOpacity="0.4" />
              </svg>
            </div>
          </div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "1rem" }}>
            Horizon Banking
          </h1>
          <p style={{ color: "#bfdbfe", fontSize: "1.125rem", lineHeight: "1.75", maxWidth: "24rem" }}>
            Manage your finances with ease. Access your accounts, transfer funds, and track your spending.
          </p>
        </div>
      </aside>
    </main>
  );
}