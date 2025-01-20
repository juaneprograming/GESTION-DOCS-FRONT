// app/layout.js
import { Geist, Poppins } from "next/font/google";
import { Sidebar } from "@/app/sidebar";
import { Navbar } from "@/app/navbar";

import "./globals.css";


const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "Dashboard",
  description: "Dynamic dashboard example",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased bg-gray-100`}>
        <div className="flex h-screen">
          {/* Sidebar fijo */}
          <Sidebar />

          {/* Contenido principal */}
          <div className="flex-1 flex flex-col">
            {/* Navbar fijo */}
            <Navbar />

            {/* Contenido dinámico */}
            <main className="flex-1 overflow-y-auto p-6 bg-white">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
