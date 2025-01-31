'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LogIn, Lock, Mail } from 'lucide-react';
import api from '../api/axios';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.get('/sanctum/csrf-cookie'); // Obtener el CSRF token si es necesario
      const response = await api.post('/login', formData);
      console.log('API Response:', response);

      // Almacenar el token en localStorage
      localStorage.setItem('token', response.data.token);

      console.log('Token almacenado:', response.data.token);

        // Establecer flag para mostrar la notificación después de la redirección
        localStorage.setItem('showLoginSuccess', 'true');

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('API Error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Credenciales inválidas, intenta de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-50" />
      </div>

      <Card className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-3xl">
        <div className="space-y-2 text-center">
          <div className="inline-block p-3 rounded-full bg-gray-100">
            <LogIn className="w-6 h-6 text-gray-600" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Iniciar Sesión</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                name="username"
                placeholder="Ingrese su Usuario"
                className="pl-10"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                name="password"
                placeholder="Contraseña"
                className="pl-10"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Iniciar Sesión
          </Button>
        </form>
      </Card>
    </div>
  );
}
