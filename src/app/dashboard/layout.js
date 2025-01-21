import { Sidebar } from "@/app/componentes/sidebar";
import { Navbar } from "@/app/componentes/navbar";

export default function DashboardLayout({ children }) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto bg-white">{children}</main>
        </div>
      </div>
    );
  }