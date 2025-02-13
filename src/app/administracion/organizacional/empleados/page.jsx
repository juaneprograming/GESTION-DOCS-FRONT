"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/app/dashboard/layout"
import { CreateEmpleado } from "./create/page"
import { EditEmpleado } from "./edit/page"

const Empleados = () => {
  const [empleados, setEmpleados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [refreshFlag, setRefreshFlag] = useState(false)

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados?page=${currentPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setEmpleados(response.data) // Guardamos toda la respuesta
      } catch (err) {
        console.error("Error fetching empleados:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEmpleados()
  }, [currentPage, refreshFlag])

  const handleRefresh = () => setRefreshFlag((prev) => !prev)

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Resetear a la primera página cuando el usuario busca
  }

  const filteredEmpleados = empleados?.data?.data
    ? empleados.data.data.filter(
        (empleado) =>
          `${empleado.nombre_1} ${empleado.nombre_2 || ''} ${empleado.apellido_1 || ''} ${empleado.apellido_2 || ''}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          empleado.correo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-semibold tracking-tight">Empleados</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <CreateEmpleado onEmpleadoCreado={handleRefresh} />
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <Input
            placeholder="Buscar por nombre o correo..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

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
                filteredEmpleados.map((empleado) => (
                  <TableRow key={empleado.id}>
                    <TableCell>{empleado.tipo_identificacion}</TableCell>
                    <TableCell>{empleado.numero_identificacion}</TableCell>
                    <TableCell>
                      {`${empleado.nombre_1} ${empleado.nombre_2 || ''} ${empleado.apellido_1 || ''} ${empleado.apellido_2 || ''}`.trim()}
                    </TableCell>
                    <TableCell>{empleado.correo}</TableCell>
                    <TableCell>{empleado.cargo?.nombre || "Sin asignar"}</TableCell>
                    <TableCell className="text-right">
                      <EditEmpleado empleadoId={empleado.id} onEmpleadoActualizado={handleRefresh} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Página {empleados?.data?.current_page} de {empleados?.data?.last_page}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!empleados?.data?.prev_page_url}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              ⟨ Anterior
            </Button>
            <Button
              variant="outline"
              disabled={!empleados?.data?.next_page_url}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Siguiente ⟩
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Empleados
