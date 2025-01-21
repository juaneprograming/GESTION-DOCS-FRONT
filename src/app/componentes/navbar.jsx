"use client";

import {
  Bell,
  MessageCircle,
  Search,
  Settings,
  User,
  FileText,
  Clock,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importar useRouter
import api from "@/app/api/axios";

export function Navbar() {
  const [data, setData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter(); // Inicializar el router para redirecciones

  useEffect(() => {
    // Verificar si existe el token al cargar el componente
    checkAuth();

    // Obtener datos del dashboard si está autenticado
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const checkAuth = () => {
    const token = document.cookie.includes("token=");
    setIsAuthenticated(token);
  };

  const fetchDashboardData = () => {
    api
      .get("/dashboard")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  };

  const handleLogout = () => {
    // Eliminar la cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

    // Limpiar los datos del dashboard
    setData({});

    // Actualizar el estado de autenticación
    setIsAuthenticated(false);

    // Opcional: Reiniciar el estado de la API si es necesario
    if (api.defaults.headers.common["Authorization"]) {
      delete api.defaults.headers.common["Authorization"];
    }

    // Redirigir al login
    router.push("/login");
  };

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <nav className="border-b bg-white">
      <div className="flex h-[60px] items-center px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-black">Bienvenido</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5 text-black" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-500" />
          </button>
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <MessageCircle className="h-5 w-5 text-black" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-green-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="h-5 w-5 text-black" />
          </button>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-8 w-8 rounded-full overflow-hidden hover:ring-2 hover:ring-gray-200 transition-all"
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WFtB4q2x4n4Msf43YU4YiikGKIzWGJ.png"
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-1 z-50">
                <div className="px-4 py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WFtB4q2x4n4Msf43YU4YiikGKIzWGJ.png"
                      alt="Albert Flores"
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-black">Albert Flores</div>
                      <div className="text-sm text-black">flores@doe.io</div>
                    </div>
                  </div>
                </div>

                <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50 flex items-center space-x-2">
                  <User className="h-4 w-4 text-black" />
                  <span>My Profile</span>
                </button>

                <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50 flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-black" />
                  <span>Account Settings</span>
                </button>

                <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50 flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-black" />
                  <span>Activity Log</span>
                </button>

                <div className="border-t my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                >
                  <LogOut className="h-4 w-4 text-red-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
