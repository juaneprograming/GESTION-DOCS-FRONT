'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Obtén el token de localStorage
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response:', response.data); // Verificar la respuesta de la API
        setUsers(response.data.usuarios); // Accede a la propiedad 'usuarios' del objeto de respuesta
        console.log('Updated Users State:', response.data.usuarios); // Verificar el estado de usuarios
      } catch (err) {
        console.error("Error fetching users:", err); // Imprimir error en la consola
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </li>
        ))}
      </ul>
      <p>Aqui los usuarios</p>
    </div>
  );
};

export default Users;
