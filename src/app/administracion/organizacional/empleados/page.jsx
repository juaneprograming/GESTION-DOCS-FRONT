'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit2, Plus } from 'lucide-react'
import axios from 'axios'


const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true); // Agregamos el estado loading
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Obtén el token de localStorage
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response:', response.data); // Verificar la respuesta de la API
        setEmpleados(response.data.data || []); // Asegúrate de que sea un array
        console.log('Updated empleados State:', response.data.data); // Verificar el estado de usuarios
      } catch (err) {
        console.error("Error fetching empleados:", err); // Imprimir error en la consola
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleados();
  }, []);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-6">
      <h1>Empleados</h1>
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
            {empleados.map((empleado) => (
              <TableRow key={empleado.id}>
                <TableCell>{empleado.nombre_1}</TableCell>
                <TableCell>{empleado.nombre_2}</TableCell>
                <TableCell>{empleado.correo}</TableCell>
                <TableCell>{empleado.apellidp_1}</TableCell>
                <TableCell>{empleado.apellido_2}</TableCell>
                <TableCell>{empleado.tipo_identificacion}</TableCell>
                <TableCell>{empleado.numero_identificacion}</TableCell>
                <TableCell>{empleado.expiresAt || 'Sin fecha'}</TableCell>
                <TableCell>
                  <Badge variant={empleado.estado ? "default" : "secondary"}>
                    {empleado.isAdmin ? "Sí" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={empleado.isActive ? "success" : "destructive"}>
                    {empleado.isActive ? "Activo" : "Inactivo"}
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

export default Empleados;
