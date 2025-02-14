'use client'

import DashboardLayout from "@/app/dashboard/layout"
import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Breadcrumb } from "@/app/componentes/breadcrumb"
import axios from "axios"
import { CreateCargo } from "./create/page"
import { EditCargo } from "./edit/page"

const Cargos = () => {
  const [cargos, setCargos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Número de elementos por página

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/administracion/cargos`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        setCargos(response.data.data)
      } catch (err) {
        console.error("Error fetching cargos:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCargos()
  }, [refreshFlag])

  const handleRefresh = () => setRefreshFlag(prev => !prev)

  const filteredCargos = cargos.filter(
    (cargo) =>
      cargo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cargo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calcular los índices de los elementos a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCargos.slice(indexOfFirstItem, indexOfLastItem)

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Cargos</h2>
            <Breadcrumb />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <div>
              <CreateCargo onSuccess={handleRefresh} />
            </div>
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
              ) : currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    No se encontraron cargos
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((cargo) => (
                  <TableRow key={cargo.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{cargo.nombre}</TableCell>
                    <TableCell>{cargo.descripcion}</TableCell>
                    <TableCell className="text-right">
                      <EditCargo cargoId={cargo.id} onSuccess={handleRefresh} />
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
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {Math.ceil(filteredCargos.length / itemsPerPage)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              ⟨ Anterior
            </Button>
            <Button
              variant="outline"
              disabled={indexOfLastItem >= filteredCargos.length}
              onClick={() => paginate(currentPage + 1)}
            >
              Siguiente ⟩
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Cargos
