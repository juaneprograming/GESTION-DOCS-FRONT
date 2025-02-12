import api from 'axios';

const getUsers = async () => {
  try {
    const response = await api.get('/administracion/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const response = await api.get(`/administracion/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const response = await api.post('/administracion/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/administracion/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/administracion/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getUsers,
  getUserById, // Nueva función
  createUser,
  updateUser,
  deleteUser,
};
