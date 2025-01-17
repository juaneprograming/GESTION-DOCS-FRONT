'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api/axios';
import Cookies from 'js-cookie';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.get('/sanctum/csrf-cookie');
      const response = await api.post('/login', formData);
      console.log('API Response:', response);
      Cookies.set('token', response.data.token); 
      router.push('/dashboard'); 
    } catch (err) {
      console.error('API Error:', err);
      setError('Credenciales inválidas, intenta de nuevo.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-scree">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Correo:</label>
            <input
              className="border-2 border-gray-300 p-2 rounded-lg w-full"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Contraseña:</label>
            <input
              className="border-2 border-gray-300 p-2 rounded-lg w-full"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600 transition duration-200"
            type="submit"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
