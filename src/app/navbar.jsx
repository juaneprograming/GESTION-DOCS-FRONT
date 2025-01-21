"use client"

import { Bell, MessageCircle, Search, Settings, User, FileText, Clock, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'; // Importar useRouter
import api from '@/app/api/axios';

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
    const token = document.cookie.includes('token=');
    setIsAuthenticated(token);
  };

  const fetchDashboardData = () => {
    api.get('/dashboard')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
      });
  };

  const handleLogout = () => {
    // Eliminar la cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

    // Limpiar los datos del dashboard
    setData({});

    // Actualizar el estado de autenticación
    setIsAuthenticated(false);

    // Opcional: Reiniciar el estado de la API si es necesario
    if (api.defaults.headers.common['Authorization']) {
      delete api.defaults.headers.common['Authorization'];
    }

    // Redirigir al login
    router.push('/login');
  };

  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])


  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-4">
          <form className="w-96">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your page..."
                className="w-full rounded-md border border-gray-200 pl-8 py-2 pr-10 text-sm outline-none focus:border-blue-500"
                onClick={() => setOpen(true)}
              />
              <kbd className="pointer-events-none absolute right-2 top-2.5 select-none rounded bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500">
                ⌘K
              </kbd>
            </div>
          </form>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-500" />
          </button>
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <MessageCircle className="h-5 w-5 text-gray-600" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-green-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="h-5 w-5 text-gray-600" />
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
                      <div className="font-medium">Albert Flores</div>
                      <div className="text-sm text-gray-500">flores@doe.io</div>
                    </div>
                  </div>
                </div>

                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </button>

                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>

                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Activity Log</span>
                </button>

                <div className="border-t my-1"></div>

                <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="fixed left-1/2 top-24 -translate-x-1/2 w-full max-w-lg bg-white rounded-lg shadow-lg">
            <div className="p-4">
              <input
                type="text"
                placeholder="Type a command or search..."
                className="w-full rounded-md border border-gray-200 p-2 text-sm outline-none focus:border-blue-500"
                autoFocus
              />
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">Suggestions</p>
                <ul className="space-y-1">
                  <li className="px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer text-sm">Calendar</li>
                  <li className="px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer text-sm">Search Messages</li>
                  <li className="px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer text-sm">Settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}