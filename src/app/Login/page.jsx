'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api/axios';
import Cookies from 'js-cookie'; // Importamos Cookies

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
            // Obtener el token CSRF
            await api.get('/sanctum/csrf-cookie');

            // Enviar la solicitud de inicio de sesión
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
        <div className="login-container">
            <h1>Iniciar Sesión</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Correo:</label>
                    <input className='border-2 border-gray-300 p-2 rounded-lg'
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                    className='border-2 border-gray-300 p-2 rounded-lg'
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button className="border-1 border-blue-100 rounded-sm" type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
}
