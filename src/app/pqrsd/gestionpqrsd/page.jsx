'use client'

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/app/dashboard/layout"
import { Breadcrumb } from "@/app/componentes/breadcrumb"
import { useRouter } from "next/navigation"

const GestionPqrsd = () => {
  const [pqrsdList, setPqrsdList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const router = useRouter()

  // Mapa de roles a estados permitidos
  const roleStateMap = {
    "Radicador": ["RADICADA"],
    "Distribuidor": ["EN_DISTRIBUCION"],
    "Tramitador": ["EN_TRAMITE"],
    "Cierre": ["CIERRE"],
  }

  // Obtener rol del usuario desde la API
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/role`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setUserRole(response.data.role)
        console.log("User role:", response.data.role)
      } catch (error) {
        console.error("Error al obtener el rol:", error)
      } finally {

      }
    }
    fetchUserRole()
  }, [])

  // Obtener lista de PQRSD
  useEffect(() => {
    const fetchPQRSD = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pqrsd`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (Array.isArray(response.data)) {
          setPqrsdList(response.data)
        } else {
          console.error('La respuesta no es un array:', response.data)
          setPqrsdList([])
        }

      } catch (err) {
        console.error("Error fetching PQRSD:", err)
        setError(err.message)
        setPqrsdList([])
      } finally {
        setLoading(false)
      }
    }

    fetchPQRSD()
  }, [refreshFlag])

  const handleRefresh = () => {
    setRefreshFlag(prev => !prev)
  }

  // Filtrar PQRSD por rol (Admin ve todas)
  const filteredByRole = Array.isArray(pqrsdList)
    ? userRole === "Admin"
      ? pqrsdList 
      : pqrsdList.filter(pqrsd =>
          roleStateMap[userRole]?.includes(pqrsd.estado.toUpperCase())
        )
    : []

  // Aplicar búsqueda sobre los filtrados por rol
  const finalFilteredPQRSD = filteredByRole
    .filter(pqrsd => pqrsd.estado.toUpperCase() !== "EN_CIERRE")
    .filter(pqrsd =>
      Object.values(pqrsd).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )

  // Mostrar badge según estado
  const getStatusBadge = (estado) => {
    const normalizedEstado = estado.toUpperCase()
    const statusMap = {
      RADICADA: { label: 'Radicada', variant: 'secondary' },
      EN_DISTRIBUCION: { label: 'En Distribución', variant: 'default' },
      EN_TRAMITE: { label: 'En Trámite', variant: 'success' },
    }
    return (
      <Badge variant={statusMap[normalizedEstado]?.variant || 'outline'}>
        {statusMap[normalizedEstado]?.label || estado}
      </Badge>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Gestión de PQRSD</h2>
            <Breadcrumb />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex justify-between gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Buscar PQRSD..."
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
                <TableHead className="text-center">Número de Radicado</TableHead>
                <TableHead className="text-center">Tipo</TableHead>
                <TableHead className="text-center">Motivo</TableHead>
                <TableHead className="text-center">Fecha Radicación</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
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
              ) : finalFilteredPQRSD.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No se encontraron PQRSD
                  </TableCell>
                </TableRow>
              ) : (
                finalFilteredPQRSD.map((pqrsd) => (
                  <TableRow key={pqrsd.id}>
                    <TableCell className="font-medium text-center">{pqrsd.numero_radicado}</TableCell>
                    <TableCell className="text-center">{pqrsd.tipo_solicitud}</TableCell>
                    <TableCell className="text-center">{pqrsd.motivo}</TableCell>
                    <TableCell className="text-center">
                      {new Date(pqrsd.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(pqrsd.estado)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/pqrsd/gestionpqrsd/edit?id=${pqrsd.id}`)}
                      >
                        Detalle
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

export default GestionPqrsd
