"use client"

import DashboardLayout from "@/app/dashboard/layout"
import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
import { Breadcrumb } from "@/app/componentes/breadcrumb"
import axios from "axios"

const Cargos = () => {
  const [cargos, setCargos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/cargos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setCargos(response.data.data || [])
      } catch (err) {
        console.error("Error fetching cargos:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCargos()
  }, [])

  const filteredCargos = cargos.filter(
    (cargo) =>
      cargo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cargo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Cargos</h2>
            
            <Breadcrumb/>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Cargo
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o descripción..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Nombre</TableHead>
                <TableHead className="font-semibold">Descripción</TableHead>
                <TableHead className="w-[100px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-red-500">
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : filteredCargos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    No se encontraron cargos
                  </TableCell>
                </TableRow>
              ) : (
                filteredCargos.map((cargo) => (
                  <TableRow key={cargo.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{cargo.nombre}</TableCell>
                    <TableCell>{cargo.descripcion}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Editar cargo</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Cargo</DialogTitle>
                            <DialogDescription>
                              <form className="space-y-4 mt-4">
                                <div className="space-y-2">
                                  <label htmlFor="nombre" className="text-sm font-medium">
                                    Nombre
                                  </label>
                                  <Input id="nombre" defaultValue={cargo.nombre} placeholder="Nombre del cargo" />
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor="descripcion" className="text-sm font-medium">
                                    Descripción
                                  </label>
                                  <Input
                                    id="descripcion"
                                    defaultValue={cargo.descripcion}
                                    placeholder="Descripción del cargo"
                                  />
                                </div>
                                <Button type="submit" className="w-full">
                                  Guardar cambios
                                </Button>
                              </form>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filas por página</span>
            <select className="rounded-md border bg-transparent px-2 py-1 text-sm">
              <option>10</option>
              <option>20</option>
              <option>30</option>
              <option>40</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Página 1 de 1</span>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" disabled>
                ⟨
              </Button>
              <Button variant="outline" size="icon" disabled>
                ⟩
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Cargos

