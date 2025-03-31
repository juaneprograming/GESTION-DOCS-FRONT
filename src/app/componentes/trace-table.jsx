"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import axios from "axios"
import { useSearchParams } from "next/navigation";

export default function TraceTable() {
  const [traceData, setTraceData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [searchTerm, setSearchTerm] = useState("")
  const [tareaFilter, setTareaFilter] = useState("all-tareas")
  const [usuarioFilter, setUsuarioFilter] = useState("all-usuarios")

  useEffect(() => {
    const fetchTraceData = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/traza/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log("DATA:", response.data)
        // Si necesitas acceder a data.data, cambia aquí
        const data = response.data.data;
        setTraceData(Array.isArray(data) ? data : data ? [data] : []);

      } catch (err) {
        setError(err.message || "Error desconocido")
      } finally {
        setLoading(false)
      }
    }
  
    fetchTraceData()
  }, [id])
  

  const uniqueTareas = Array.isArray(traceData) ? [...new Set(traceData.map((item) => item.tarea))] : []
  const uniqueUsuarios = Array.isArray(traceData) ? [...new Set(traceData.map((item) => item.usuario))] : []

  const filteredData = traceData.filter((item) => {
    const matchesSearch =
      searchTerm === "" || Object.values(item).some((val) => typeof val === "string" && val.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTarea = tareaFilter === "all-tareas" || item.tarea === tareaFilter
    const matchesUsuario = usuarioFilter === "all-usuarios" || item.usuario === usuarioFilter
    return matchesSearch && matchesTarea && matchesUsuario
  })

  return (
    <div className="p-4 text-muted-foreground">
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
                {uniqueTareas.map((tarea, index) => (
                  <SelectItem key={`tarea-${index}`} value={tarea}>
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
                {uniqueUsuarios.map((usuario, index) => (
                  <SelectItem key={`usuario-${index}`} value={usuario}>
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

      <div className="rounded-md border shadow-sm">
        {loading ? (
          <div className="p-4 text-center">Cargando datos...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-primary text-center">Tarea</TableHead>
                <TableHead className="font-bold text-primary text-center">Fecha</TableHead>
                <TableHead className="font-bold text-primary text-center">Hora</TableHead>
                <TableHead className="font-bold text-primary text-center">Usuario</TableHead>
                <TableHead className="font-bold text-primary text-center">Traza</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((traza, index) => (
                  <TableRow key={`traza-${index}`} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground text-center">{traza.tarea_actual}</TableCell>
                    <TableCell className="text-foreground text-center">
                      {new Date(traza.created_at).toLocaleDateString()} 
                    </TableCell>
                    <TableCell className="text-foreground text-center">
                     {new Date(traza.created_at).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="text-foreground text-center">{traza.tramitador_actual}</TableCell>
                    <TableCell className="text-foreground text-center">{traza.descripcion_flujo}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        <div className="text-sm font-medium">{filteredData.length > 0 ? `1 - ${filteredData.length}` : "0 - 0"}</div>
        <Button variant="outline" size="sm" disabled>
          Siguiente
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
