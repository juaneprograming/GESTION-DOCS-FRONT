'use client'
import  DashboardLayout  from "@/app/dashboard/layout";


import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit2, Plus } from 'lucide-react'
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Cargos = () => {
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/cargos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response:', response.data);
        setCargos(response.data.data || []);
        console.log('Updated empleados State:', response.data.data);
      } catch (err) {
        console.error("Error fetching empleados:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCargos();
  }, []);
  
  
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;
  
  return (
      <DashboardLayout>

    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Cargos</h1>
      <div className="mb-4 flex justify-end">
        <Button variant="ghost" size="icon" className="h-8 w-8 bg-blue-500 text-white hover:bg-blue-600">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Crear Usuario</span>
        </Button>
      </div>
      <div className="rounded-lg border bg-white shadow-md p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-left">Nombre</TableHead>
              <TableHead className="font-semibold text-left">Descripcion</TableHead>
              <TableHead className="font-semibold text-left">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargos.map((cargo) => (
              <TableRow key={cargo.id} className="hover:bg-gray-100">
                <TableCell className="py-2">{cargo.nombre}</TableCell>
                <TableCell className="py-2">{cargo.descripcion}</TableCell>
                <TableCell className="py-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-bold">EDITAR CARGO</DialogTitle>
                        <DialogDescription className="space-y-4">
                          <Input placeholder="Nombre" className="w-full" />
                          <Input placeholder="Descripcion" className="w-full" />
                          <Button variant="blue" className="w-full">Guardar</Button>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
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

export default Cargos;
