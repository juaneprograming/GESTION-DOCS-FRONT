import api from './axios';
import config from './config';

const login = async (credentials) => {
  try {
    await api.get('/sanctum/csrf-cookie');  // Obtener CSRF cookie si es necesario
    const response = await api.post('/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    await api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    throw error;
  }
};

const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  login,
  logout,
  getProfile,
};
