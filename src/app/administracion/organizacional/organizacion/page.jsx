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
import DashboardLayout from "@/app/dashboard/layout"
import { Breadcrumb } from "@/app/componentes/breadcrumb"
import { CreateEntidad } from "./create/page"
import { EditEntidad } from "./edit/page"

const Entidades = () => {
  const [entidades, setEntidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshFlag, setRefreshFlag] = useState(false)

  const fetchEntidades = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/entidades`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setEntidades(response.data.data)
    } catch (err) {
      console.error("Error fetching entidades:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchEntidades()
  }, [refreshFlag])

   // Función para forzar actualización
   const handleRefresh = () => {
    setRefreshFlag(prev => !prev)
  }

  const filteredEntidades = entidades.filter(
    (entidad) =>
      entidad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(entidad.nit || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Entidades</h2>
            <Breadcrumb />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <CreateEntidad onEntidadCreado={() => fetchEntidades()} />
          </div>
        </div>

        {/* Search */}
        <div className="flex justify-between gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Buscar por nombre o NIT..."
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
                <TableHead>Nombre</TableHead>
                <TableHead>NIT</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Misión</TableHead>
                <TableHead>Visión</TableHead>
                {/* <TableHead>Logo</TableHead> */}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-red-500">
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : filteredEntidades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No se encontraron entidades
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntidades.map((entidad) => (
                  <TableRow key={entidad.id}>
                    <TableCell>{entidad.nombre}</TableCell>
                    <TableCell>{entidad.nit}</TableCell>
                    <TableCell>{entidad.direccion}</TableCell>
                    <TableCell>{entidad.mision}</TableCell>
                    <TableCell>{entidad.vision}</TableCell>
                    {/* <TableCell>{entidad.logo}</TableCell> */}
                    <TableCell className="text-right">
                      <EditEntidad
                        entidadId={entidad.id} // <--- Asegúrate que esto existe y es correcto
                        onEntidadActualizada={handleRefresh}
                      />
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

export default Entidades
