'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Download } from 'lucide-react';
import { Breadcrumb } from '@/app/componentes/breadcrumb';
import DashboardLayout from '@/app/dashboard/layout';
import { CreateExpediente } from './create/page';
import { useRouter } from "next/navigation"

export default function ExpedientesTable() {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(false)
  const router = useRouter()


  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/expedientes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExpedientes(response.data);
      } catch (error) {
        console.error('Error fetching expedientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpedientes();
  }, [refreshFlag]);

  const handleRefresh = () => setRefreshFlag((prev) => !prev)
  
  
  return (
      <DashboardLayout>
      <div className="p-6">
      <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Expediente</h2>
            <Breadcrumb />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <div>
              <CreateExpediente onSuccess={handleRefresh} />
            </div>
          </div>
        </div>
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">#</TableHead>
                <TableHead>N° Expediente</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Serie</TableHead>
                <TableHead>Subserie</TableHead>
                <TableHead>Fecha inicio del expediente</TableHead>
                <TableHead>Dependencia</TableHead>
                <TableHead>Usuario creador</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expedientes.map((expediente, index) => (
                <TableRow key={expediente.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{expediente.codigo_expediente}</TableCell>
                  <TableCell>{expediente.nombre_expediente}</TableCell>
                  <TableCell>{expediente.serie}</TableCell>
                  <TableCell>{expediente.subserie}</TableCell>
                  <TableCell>{expediente.fecha_expediente}</TableCell>
                  <TableCell>{expediente.dependencia}</TableCell>
                  <TableCell>aun no</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        expediente.estado === 'Cerrado'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {expediente.estado}
                    </span>
                  </TableCell>
                  <TableCell>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/gestiondocumental/informeexpediente/edit?id=${expediente.id}`)}
                    >
                      Detalles
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
}
