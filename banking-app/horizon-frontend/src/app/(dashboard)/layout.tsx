import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #f9fafb;
        }
        .dashboard-main {
          flex: 1;
          overflow: auto;
          min-width: 0;
          padding: 1.5rem;
        }
        @media (max-width: 768px) {
          .dashboard-main {
            padding: 3.2rem 1.5rem 1.5rem 1.5rem;
          }
        }
      `}</style>
      <div className="dashboard-wrapper">
        <Sidebar />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </>
  );
}