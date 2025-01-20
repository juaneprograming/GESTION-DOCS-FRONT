'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit2, Plus } from 'lucide-react'
import axios from 'axios'
// import { Plus } from 'lucide-react';
import { CreateEmpleado } from './create/page'


const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true); // Agregamos el estado loading
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold">Empleados</h1>
      <div className="mb-4 flex justify-end">
      <CreateEmpleado open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
     
      <div className="rounded-lg border bg-card shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Tipo de identificación</TableHead>
              <TableHead>Numero de identificación</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Cargo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empleados.map((empleado) => (
              <TableRow key={empleado.id}>
                <TableCell className="text-center">{empleado.tipo_identificacion}</TableCell>
                <TableCell>{empleado.numero_identificacion}</TableCell>
                <TableCell>
                  {`${empleado.nombre_1} ${empleado.nombre_2 || ''} ${empleado.apellido_1 || ''} ${empleado.apellido_2 || ''}`.trim()}
                </TableCell>
                <TableCell>{empleado.correo}</TableCell>
                <TableCell>{empleado.cargo?.nombre || 'Sin asignar'}</TableCell>
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
