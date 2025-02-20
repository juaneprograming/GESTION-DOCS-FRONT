"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit2, Plus, Download, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/app/dashboard/layout"
import { Breadcrumb } from "@/app/componentes/breadcrumb"
import { CreatePerfil } from "@/app/administracion/seguridad/perfiles/create/page"
import { EditPerfil } from "@/app/administracion/seguridad/perfiles/edit/page"
import AsignarUsuarios from "@/app/componentes/asignarUsuarios"
import { ArrowLeft } from 'lucide-react';

const Perfiles = () => {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [currentStep, setCurrentStep] = useState('list') // 'list' | 'create'

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/administracion/roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setProfiles(response.data.data)
      } catch (err) {
        console.error("Error fetching profiles:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (currentStep === 'list') {
      fetchProfiles()
    }
  }, [refreshFlag, currentStep])

  const handleRefresh = () => {
    setRefreshFlag(prev => !prev)
    setCurrentStep('list')
  }

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              {currentStep === 'list' ? 'Perfiles' : 'Asignar Perfil'}
            </h2>
            <Breadcrumb />
          </div>
          <div className="flex gap-2">
            {currentStep === 'list' ? (
              <>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
                {/* Nuevo botón para cambiar al paso de creación */}
                <Button onClick={() => setCurrentStep('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Asignar Perfil
                </Button>
                {/* Botón existente de CreatePerfil */}
                <div>
                  <CreatePerfil onSuccess={handleRefresh} />
                </div>

              </>
            ) : (
              <Button variant="outline" onClick={() => setCurrentStep('list')}>
                <ArrowLeft className="h-4 w-4" />
                Regresar al Listado
              </Button>
            )}
          </div>
        </div>

        {currentStep === 'list' ? (
          <>
            {/* Búsqueda */}
            <div className="flex justify-between gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Buscar por nombre o descripción..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Tabla */}
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-red-500">
                        Error: {error}
                      </TableCell>
                    </TableRow>
                  ) : filteredProfiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No se encontraron perfiles
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>{profile.name}</TableCell>
                        <TableCell>{profile.descripcion}</TableCell>
                        <TableCell>
                          <Badge variant={profile.estado ? "success" : "destructive"}>
                            {profile.estado ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <EditPerfil profileId={profile.id} onSuccess={handleRefresh} />
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          /* Paso de creación */
          <div>
            {/* Aquí puedes agregar el formulario o contenido del nuevo paso */}
            {/* <Button variant="outline" onClick={() => setCurrentStep('list')}>
              Volver al Listado
            </Button> */}
            <AsignarUsuarios onBack={() => setCurrentStep('list')} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Perfiles