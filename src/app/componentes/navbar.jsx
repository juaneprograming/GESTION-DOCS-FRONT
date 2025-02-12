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
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/api/axios";
// import echo from "@/utils/echo"; // Importa la configuración de Laravel Echo

export function Navbar({ onToggleSidebar }) {
  const [user, setUser] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // Estado para el menú del perfil
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false); // Estado para el menú de notificaciones
  const [bgColor, setBgColor] = useState("bg-gray-200");
  const router = useRouter();
  // const [notifications, setNotifications] = useState([]); // Estado para almacenar las notificaciones

  useEffect(() => {
    fetchUserData();
    generateRandomColor();
  }, []);

  // useEffect(() => {
  //   const channel = echo.channel("pqrsd-channel");

  //   channel.listen("new-pqrs", (data) => {
  //     console.log("📢 Notificación recibida:", data);
  //     setNotifications((prev) => [...prev, data.pqrsData]);
  //   });


  //   return () => {
  //     echo.leaveChannel("pqrsd-channel");
  //   };
  // }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/userNavbar");
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const generateRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
  };

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setUser(null);
    if (api.defaults.headers.common["Authorization"]) {
      delete api.defaults.headers.common["Authorization"];
    }
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Cerrar el menú del perfil si se hace clic fuera
      if (profileDropdownOpen && !event.target.closest(".user-dropdown")) {
        setProfileDropdownOpen(false);
      }

      // Cerrar el menú de notificaciones si se hace clic fuera
      if (
        notificationsDropdownOpen &&
        !event.target.closest(".notifications-dropdown")
      ) {
        setNotificationsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen, notificationsDropdownOpen]);

  return (
    <nav className="border-b bg-white">
      <div className="flex h-[60px] items-center px-4 justify-between">
        {/* Botón de Menú (Solo visible en dispositivos móviles) */}
        <button
          onClick={onToggleSidebar}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full md:hidden"
        >
          <Menu className="h-5 w-5 text-black" />
        </button>

        {/* Título del Navbar */}
        <div className="flex items-center gap-4">
          <h1 className="text-black">Bienvenido</h1>
        </div>

        {/* Grupo de Notificaciones y Perfil */}
        <div className="flex items-center gap-4">
          {/* Ícono de Campana con Contador de Notificaciones */}
          <div className="relative notifications-dropdown">
            {/* <button
              onClick={() =>
                setNotificationsDropdownOpen(!notificationsDropdownOpen)
              } // Alternar el menú de notificaciones
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <Bell className="h-5 w-5 text-black" />
              
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button> */}
            {/* Menú desplegable de notificaciones */}
            {notificationsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-1 z-50">
                <div className="p-4">
                  <h3 className="font-medium text-black mb-2">Notificaciones</h3>
                  {notifications.length > 0 ? (
                    <ul>
                      {notifications.map((notification, index) => (
                        <li key={index} className="text-sm text-black mb-2">
                          <strong>{notification.asunto_solicitud}</strong>
                          <br />
                          <span className="text-gray-500">
                            {notification.numero_radicado}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No hay notificaciones.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Círculo del Perfil */}
          <div className="relative user-dropdown">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={`h-8 w-8 rounded-full overflow-hidden flex items-center justify-center ${bgColor} text-white font-bold text-lg`}
            >
              {user?.profile_image ? (
                <img
                  src={user.profile_image}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              ) : user?.username ? (
                user.username.charAt(0).toUpperCase()
              ) : (
                ""
              )}
            </button>
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-auto min-w-[200px] max-w-[90vw] bg-white rounded-lg shadow-lg border py-1 z-50">
                <div className="px-4 py-3 border-b">
                  <div className="flex items-center space-x-3">
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt="User avatar"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : user?.username ? (
                      <div
                        className={`h-10 w-10 flex items-center justify-center rounded-full ${bgColor} text-white font-bold text-lg`}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      ""
                    )}
                    <div>
                      <div className="font-medium text-black">
                        {user?.username || ""}
                      </div>
                      <div className="text-sm text-black">{user?.email || ""}</div>
                    </div>
                  </div>
                </div>
                <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50 flex items-center space-x-2 whitespace-nowrap">
                  <User className="h-4 w-4 text-black" />
                  <span>Mi Perfil</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50 flex items-center space-x-2 whitespace-nowrap">
                  <Settings className="h-4 w-4 text-black" />
                  <span>Configuración</span>
                </button>
                <div className="border-t my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600 whitespace-nowrap"
                >
                  <LogOut className="h-4 w-4 text-red-600" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}