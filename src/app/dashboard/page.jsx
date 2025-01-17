'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importar useRouter
import Image from "next/image";
import api from '../api/axios';
import Login from '../login/page';

export default function Dashboard() {
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
  
  return (
    <div className="min-h-screen bg-green-100 p-8">
      <header className="bg-white shadow dark:bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <h1 className="text-xl mb-4">Esto es una prueba</h1>
        <p className="text-gray-700">{JSON.stringify(data)}</p>
      </div>
    </div>
  );
}
