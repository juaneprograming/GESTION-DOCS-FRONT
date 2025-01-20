'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit2, Plus } from 'lucide-react'
import axios from 'axios'


export default function Empleados() {
   const [empleados, setEmpleados] = useState([]);
   const [loading, setLoading] = useState(true); // Agregamos el estado loading
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetcEmpleados = async () => {
        try {
          const token = localStorage.getItem('authToken'); // Obtén el token de localStorage
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('API Response:', response.data); // Verificar la respuesta de la API
          setEmpleados(response.data.empleados || []); // Asegúrate de que sea un array
          console.log('Updated empleados State:', response.data.empleados); // Verificar el estado de usuarios
        } catch (err) {
          console.error("Error fetching empleados:", err); // Imprimir error en la consola
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
    
      fetcEmpleados();
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
                   {empleados.map((empleados) => (
                     <TableRow key={empleados.id}>
                       <TableCell>{empleados.nombre_1}</TableCell>
                       <TableCell>{empleados.nombre_2}</TableCell>
                       <TableCell>{empleados.email}</TableCell>
                       <TableCell>{empleados.createdAt}</TableCell>
                       <TableCell>{empleados.expiresAt || 'Sin fecha'}</TableCell>
                       <TableCell>
                         <Badge variant={empleados.estado ? "default" : "secondary"}>
                           {empleados.isAdmin ? "Sí" : "No"}
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <Badge variant={empleados.isActive ? "success" : "destructive"}>
                           {empleados.isActive ? "Activo" : "Inactivo"}
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
  )
}

