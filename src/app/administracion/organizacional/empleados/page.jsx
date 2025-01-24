'use client'
import React, { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit2, Plus, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/app/dashboard/layout"
import { CreateEmpleado } from "./create/page"
import { EditEmpleado } from "./edit/page"

const Empleados = () => {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmpleados(response.data.data); 
    } catch (err) {
      console.error("Error fetching empleados:", err)
      setError(err.message)
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEmpleados()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, itemsPerPage])

  const filteredEmpleados = empleados.filter((empleado) =>
    `${empleado.nombre_1} ${empleado.nombre_2 || ''} ${empleado.apellido_1 || ''} ${empleado.apellido_2 || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    empleado.correo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEmpleados = filteredEmpleados.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredEmpleados.length / itemsPerPage)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-4xl font-semibold tracking-tight">Empleados</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <CreateEmpleado onEmpleadoCreado={fetchEmpleados} />
          </div>
        </div>

        {/* Search */}
        <div className="flex justify-between gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Buscar por nombre o correo..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Identificación</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-red-500">
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : filteredEmpleados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No se encontraron empleados
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEmpleados.map((empleado) => (
                  <TableRow key={empleado.id}>
                    <TableCell>{empleado.tipo_identificacion}</TableCell>
                    <TableCell>{empleado.numero_identificacion}</TableCell>
                    <TableCell>
                      {`${empleado.nombre_1} ${empleado.nombre_2 || ''} ${empleado.apellido_1 || ''} ${empleado.apellido_2 || ''}`.trim()}
                    </TableCell>
                    <TableCell>{empleado.correo}</TableCell>
                    <TableCell>{empleado.cargo?.nombre || "Sin asignar"}</TableCell>
                    <TableCell className="text-right">
                      <EditEmpleado empleadoId={empleado.id} onEmpleadoActualizado={fetchEmpleados} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {filteredEmpleados.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span>Resultados por página:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredEmpleados.length)} de {filteredEmpleados.length} resultados
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Empleados