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

const Empleados = () => {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setEmpleados(response.data.data)
      } catch (err) {
        console.error("Error fetching empleados:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEmpleados()
  }, [])

  const filteredEmpleados = empleados.filter((empleado) =>
    `${empleado.nombre_1} ${empleado.nombre_2 || ''} ${empleado.apellido_1 || ''} ${empleado.apellido_2 || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    empleado.correo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Empleados</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
              <CreateEmpleado />
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
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Empleados