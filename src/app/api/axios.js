import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Si estás usando cookies de sesión
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;