import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // URL del backend en Railway
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Necesario para enviar y recibir cookies con Laravel Sanctum
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor para manejar respuestas con errores de autenticación (401)
api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token'); // Borra el token si la sesión expira
        window.location.href = '/login'; // Redirige al login
    }
    return Promise.reject(error);
});

export default api;
