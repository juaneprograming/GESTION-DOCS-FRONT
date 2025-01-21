'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit2, Plus } from 'lucide-react'
import axios from 'axios'
import  DashboardLayout  from "@/app/dashboard/layout";



const Entidades = () => {
  const [entidades, setEntidades] = useState([]);
  const [loading, setLoading] = useState(true); // Agregamos el estado loading
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntidades = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Obtén el token de localStorage
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/entidades`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response:', response.data); // Verificar la respuesta de la API
        setEntidades(response.data.data || []); // Asegúrate de que sea un array
        console.log('Updated empleados State:', response.data.data); // Verificar el estado de usuarios
      } catch (err) {
        console.error("Error fetching empleados:", err); // Imprimir error en la consola
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntidades();
  }, []);
  
  

  
  return (
      <DashboardLayout>

    <div className="container mx-auto py-6">
      <h1>Entidades</h1>
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
              <TableHead>Nombre</TableHead>
              <TableHead>NIT</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Misión</TableHead>
              <TableHead>Visión</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entidades.map((entidades) => (
              <TableRow key={entidades.id}>
                <TableCell>{entidades.nombre}</TableCell>
                <TableCell>{entidades.nit}</TableCell>
                <TableCell>{entidades.direccion}</TableCell>
                <TableCell>{entidades.mision}</TableCell>
                <TableCell>{entidades.vision}</TableCell>
                <TableCell>{entidades.logo}</TableCell>
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
      </DashboardLayout>
  );
};

export default Entidades;
