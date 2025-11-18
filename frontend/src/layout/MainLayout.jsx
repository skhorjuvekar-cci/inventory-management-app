import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:block">
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
