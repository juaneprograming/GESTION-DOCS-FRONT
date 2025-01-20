'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit2, Plus } from 'lucide-react'

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
    <div className="container mx-auto py-6">
      <div className="mb-4 flex justify-end">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Crear Usuario</span>
        </Button>
      </div>
      <div className="rounded-lg border bg-card shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Persona</TableHead>
              <TableHead>Correo electrónico</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead>Fecha Expiración</TableHead>
              <TableHead>Administrador</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.person}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>{user.expiresAt || 'Sin fecha'}</TableCell>
                <TableCell>
                  <Badge variant={user.estado ? "default" : "secondary"}>
                    {user.isAdmin ? "Sí" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "success" : "destructive"}>
                    {user.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
