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
import { VerPqrsd } from "./informacionpqrsd/page"
import { useRouter } from "next/navigation"


const Consulta = () => {
  const [pqrsdList, setPqrsdList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshFlag, setRefreshFlag] = useState(false)
    const router = useRouter()

  useEffect(() => {
    const fetchPQRSD = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pqrsd`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Verificación corregida
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

  // Filtrado seguro con verificación de array
  const filteredPQRSD = Array.isArray(pqrsdList)
    ? pqrsdList.filter(pqrsd =>
      Object.values(pqrsd).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    : []

  const getStatusBadge = (estado) => {
    const statusMap = {
      radicado: { label: 'Radicado', variant: 'secondary' },
      en_proceso: { label: 'En Proceso', variant: 'default' },
      resuelto: { label: 'Resuelto', variant: 'success' },
      cerrado: { label: 'Cerrado', variant: 'destructive' }
    }
    return <Badge variant={statusMap[estado]?.variant || 'outline'}>
      {statusMap[estado]?.label || estado}
    </Badge>
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Consulta de PQRSD</h2>
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
                <TableHead className="text-center">N° Radicado</TableHead>
                <TableHead className="text-center">Fecha Radicación</TableHead>
                <TableHead className="text-center">Identificacion</TableHead>
                <TableHead className="text-center">Tipo</TableHead>
                <TableHead className="text-center">Motivo</TableHead>
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
              ) : filteredPQRSD.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No se encontraron PQRSD
                  </TableCell>
                </TableRow>
              ) : (
                filteredPQRSD.map((pqrsd) => (
                  <TableRow key={pqrsd.id}>
                    <TableCell className="text-center">{pqrsd.numero_radicado}</TableCell>
                    <TableCell className="text-center">
                      {new Date(pqrsd.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">{ pqrsd.identificacion_gestor}
                    </TableCell>
                    <TableCell className="text-center">{pqrsd.tipo_solicitud}</TableCell>
                    <TableCell className="text-center">{pqrsd.motivo}</TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(pqrsd.estado)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/pqrsd/consulta/informacionpqrsd?id=${pqrsd.id}`)}
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

export default Consulta