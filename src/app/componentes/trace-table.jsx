"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

export default function TraceTable() {
  // Datos de la tabla extraídos de la imagen
  const traceData = [
    {
      tarea: "TGN - Radicación Trámite General",
      fecha: "06/03/2025 09:23:06 AM",
      usuario: "Darys Johanna Padilla Sampayo",
      traza: "Se registro una solicitud N°2025-01842",
    },
    // Añado más datos de ejemplo para demostrar la funcionalidad de filtrado
    {
      tarea: "TGN - Revisión Documentos",
      fecha: "07/03/2025 10:15:30 AM",
      usuario: "Carlos Rodríguez Méndez",
      traza: "Se revisó la documentación N°2025-01842",
    },
    {
      tarea: "TGN - Aprobación Trámite",
      fecha: "08/03/2025 14:45:22 PM",
      usuario: "Darys Johanna Padilla Sampayo",
      traza: "Se aprobó la solicitud N°2025-01842",
    },
  ]

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [tareaFilter, setTareaFilter] = useState("all-tareas")
  const [usuarioFilter, setUsuarioFilter] = useState("all-usuarios")

  // Obtener valores únicos para los filtros
  const uniqueTareas = [...new Set(traceData.map((item) => item.tarea))]
  const uniqueUsuarios = [...new Set(traceData.map((item) => item.usuario))]

  // Filtrar los datos según los criterios
  const filteredData = traceData.filter((item) => {
    const matchesSearch =
      searchTerm === "" || Object.values(item).some((val) => val.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTarea = tareaFilter === "all-tareas" || item.tarea === tareaFilter
    const matchesUsuario = usuarioFilter === "all-usuarios" || item.usuario === usuarioFilter

    return matchesSearch && matchesTarea && matchesUsuario
  })

  return (
    <div className="p-4 text-muted-foreground">
      

      {/* Buscador y filtros */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en todos los campos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-col sm:flex-row">
            <Select value={tareaFilter} onValueChange={setTareaFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por Tarea" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-tareas">Todas las Tareas</SelectItem>
                {uniqueTareas.map((tarea) => (
                  <SelectItem key={tarea} value={tarea}>
                    {tarea}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={usuarioFilter} onValueChange={setUsuarioFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por Usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-usuarios">Todos los Usuarios</SelectItem>
                {uniqueUsuarios.map((usuario) => (
                  <SelectItem key={usuario} value={usuario}>
                    {usuario}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setTareaFilter("all-tareas")
                setUsuarioFilter("all-usuarios")
              }}
            >
              Limpiar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla con estilos mejorados */}
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold text-primary text-center">Tarea</TableHead>
              <TableHead className="font-bold text-primary text-center">Fecha</TableHead>
              <TableHead className="font-bold text-primary text-center">Usuario</TableHead>
              <TableHead className="font-bold text-primary text-center">Traza</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="font-medium text-foreground">{row.tarea}</TableCell>
                  <TableCell className="text-foreground">{row.fecha}</TableCell>
                  <TableCell className="text-foreground">{row.usuario}</TableCell>
                  <TableCell className="text-foreground">{row.traza}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" disabled={true}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        <div className="text-sm font-medium">{filteredData.length > 0 ? `1 - ${filteredData.length}` : "0 - 0"}</div>
        <Button variant="outline" size="sm" disabled={true}>
          Siguiente
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

