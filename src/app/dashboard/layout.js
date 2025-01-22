'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/componentes/navbar";
import { Sidebar } from "@/app/componentes/sidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtener el token de localStorage

    if (!token) {
      router.push("/login"); // Redirige si no hay token
    }
  }, [router]);

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
