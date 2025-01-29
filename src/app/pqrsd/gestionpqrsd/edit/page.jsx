"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Printer, Download, MessageSquarePlus, Edit, Plus } from "lucide-react"
import { ActionMenu } from "../../../componentes/actionmenu"
import { GestorForm } from "../../../componentes/gestorform"
import  Formdocument  from "../../../componentes/gestiondocument"
import { SolicitanteForm } from "../../../componentes/solicitanteform"
import  Observationsmanagment  from "../../../componentes/ObservationsManagement"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import DashboardLayout from "@/app/dashboard/layout"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { useEffect, useState } from "react"

export function EditGestion() {
    const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [pqrsdData, setPqrsdData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPQRSD = async () => {
          try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nuevapqrsd/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            setPqrsdData(response.data)
          } catch (err) {
            console.error("Error fetching PQRSD:", err)
            setError(err.message)
          } finally {
            setLoading(false)
          }
        }
    
        if (id) fetchPQRSD()
        else setLoading(false)
      }, [id])

      useEffect(() => {
        console.log("ID recibido:", id);
      }, [id]);
      
    
      if (loading) {
        return (
          <DashboardLayout>
            <div className="p-6">Cargando detalles de la PQRSD...</div>
          </DashboardLayout>
        )
      }
      if (error){
        return (
          <DashboardLayout>
            <div className="p-6">Error: {error}</div> 
          </DashboardLayout>
        )}


    return (
        <DashboardLayout>
            <TooltipProvider>
                <div className="container mx-auto p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">GESTIÓN PQRSD</h1>
                        <div className="flex items-center gap-2">
                            <span>Gestión de PQRSD</span>
                            <span>›</span>
                            <span>Información PQRSD</span>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex justify-center items-center gap-4 py-2">
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span>Iniciada</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Estado inicial de la solicitud</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span>Ejecutando</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Solicitud en proceso de gestión</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span>Finalizada</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Solicitud completada</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                    <span>En Espera</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Solicitud pendiente de acción</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Workflow Status */}
                    <div className="flex justify-between items-center px-20">
                        <div className="text-center">
                            <div className="w-8 h-8 rounded-full bg-green-500 mx-auto mb-2"></div>
                            <span>Radicación</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
                        <div className="text-center">
                            <div className="w-8 h-8 rounded-full bg-red-500 mx-auto mb-2"></div>
                            <span>TGN - Distribución</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
                        <div className="text-center">
                            <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto mb-2"></div>
                            <span>TGN - Trámite</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <Card>
                        <CardContent className="p-4">
                            <Tabs defaultValue="solicitud" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="solicitud">Numero de la Solicitud</TabsTrigger>
                                    <TabsTrigger value="gestor">Datos del Gestor</TabsTrigger>
                                    <TabsTrigger value="solicitante">Datos del Solicitante</TabsTrigger>
                                    <TabsTrigger value="documentos">Documentos</TabsTrigger>
                                    <TabsTrigger value="observaciones">Observaciones</TabsTrigger>
                                </TabsList>

                                <TabsContent value="solicitud" className="space-y-4 mt-6">
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-xl font-semibold">Solicitud N° 2025-00001</h2>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Editar</span>
                                            </Button>
                                            <ActionMenu />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium">Número de Radicado</label>
                                                <Input value={pqrsdData.numero_radicado || ''} readOnly />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Asunto de la Solicitud</label>
                                                <Input
                                                    value={pqrsdData.asunto_solicitud || ''}
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Tipo</label>
                                                <Input value={pqrsdData.tipo || ''} readOnly />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Estado</label>
                                                <Input value={pqrsdData.estado || ''} readOnly />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium">Motivo</label>
                                                <Input value={pqrsdData.motivo || ''} readOnly />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Fecha Radicado</label>
                                                <Input
                                                    value={new Date(pqrsdData.fecha_radicado).toLocaleDateString() || ''}
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Medio de Radicación</label>
                                                <Input value={pqrsdData.medio_radicacion || ''} readOnly />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Fecha Inicio</label>
                                                <Input
                                                    value={new Date(pqrsdData.created_at).toLocaleDateString() || ''}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="gestor" className="mt-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-semibold">Datos del Gestor</h2>
                                        <ActionMenu />
                                    </div>
                                    <GestorForm />
                                </TabsContent>
                                <TabsContent value="solicitante" className="mt-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-semibold">Datos del Solicitante</h2>
                                        <ActionMenu />
                                    </div>
                                    <SolicitanteForm />
                                </TabsContent>
                                <TabsContent value="documentos" className="mt-6">                                  
                                    <Formdocument/>
                                </TabsContent>
                                <TabsContent value="observaciones" className="mt-6">
                                    
                                        <Observationsmanagment/>
                                   
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </TooltipProvider>
        </DashboardLayout>
    )
}

export default EditGestion

