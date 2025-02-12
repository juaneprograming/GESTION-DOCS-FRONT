"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Download, MessageSquarePlus, Edit, Plus } from "lucide-react";
import { ActionMenu } from "../../../componentes/actionmenu";
import { GestorForm } from "../../../componentes/gestorform";
import Formdocument from "../../../componentes/gestiondocument";
import { SolicitanteForm } from "../../../componentes/solicitanteform";
import Observationsmanagment from "../../../componentes/ObservationsManagement";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import DashboardLayout from "@/app/dashboard/layout";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function EditGestion() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [pqrsdData, setPqrsdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null); // Guardar una copia inicial de los datos

  useEffect(() => {
    const fetchPQRSD = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPqrsdData(response.data);
        setOriginalData({ ...response.data }); // Guardar una copia inicial de los datos
      } catch (err) {
        console.error("Error fetching PQRSD:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPQRSD();
    else setLoading(false);
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true); // Habilitar el modo edición
  };

  useEffect(() => {
    console.log("ID recibido:", id);
  }, [id]);

  const handleSave = async () => {
    try {
      // Verificar que los datos originales y actuales estén disponibles
      if (!originalData || !pqrsdData) {
        console.error("Datos originales o actuales no están disponibles");
        toast.error("Ocurrió un error al comparar los datos.");
        return;
      }
  
      // Comparar los datos originales con los datos actuales
      const hasChanges = Object.keys(originalData).some(
        (key) => originalData[key] !== pqrsdData[key]
      );
  
      if (!hasChanges) {
        // Si no hay cambios, mostrar un mensaje informativo
        toast.info("No se ha modificado ningún campo.");
        setIsEditing(false); // Desactivar el modo edición
        return;
      }
  
      const token = localStorage.getItem("token");
  
      // Enviar solo los campos editables al backend
      const transformedData = {
        form_type: "solicitud",
        tipo_solicitud: pqrsdData.tipo_solicitud,
        asunto_solicitud: pqrsdData.asunto_solicitud,
        motivo: pqrsdData.motivo,
        medio_radicacion: pqrsdData.medio_radicacion,
        estado: pqrsdData.estado,
        fecha_radicado: pqrsdData.fecha_radicado, // Asegúrate de incluir este campo
        fecha_inicio: pqrsdData.created_at,
      };
  
      console.log("Datos enviados al backend:", transformedData);
  
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${id}`,
        transformedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setIsEditing(false); // Desactivar el modo edición después de guardar
      setOriginalData({ ...pqrsdData }); // Actualizar los datos originales
      toast.success("Datos actualizados correctamente");
    } catch (err) {
      let errorMessage = "Ocurrió un error desconocido";
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        errorMessage = err.response.data?.error || "Error en el servidor";
      } else if (err.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorMessage = "No se recibió respuesta del servidor";
      } else {
        // Otro tipo de error
        errorMessage = err.message;
      }
      console.error("Error updating PQRSD data:", errorMessage);
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">Cargando detalles de la PQRSD...</div>
      </DashboardLayout>
    );
  }
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">Error: {error}</div>
      </DashboardLayout>
    );
  }

  // Determinar la inicial según el tipo de solicitud
  const getSolicitudInicial = (tipo_solicitud) => {
    switch (tipo_solicitud) {
      case "Denuncia":
        return "D";
      case "queja":
        return "Q";
      case "Peticion":
        return "P";
      case "Reclamo":
        return "R";
      case "Sugerencia":
        return "S";
      default:
        return "";
    }
  };

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
                  <TabsTrigger value="solicitud">
                    Numero de la Solicitud
                  </TabsTrigger>
                  <TabsTrigger value="gestor">Datos del Gestor</TabsTrigger>
                  <TabsTrigger value="solicitante">
                    Datos del Solicitante
                  </TabsTrigger>
                  <TabsTrigger value="documentos">Documentos</TabsTrigger>
                  <TabsTrigger value="observaciones">Observaciones</TabsTrigger>
                </TabsList>

                <TabsContent value="solicitud" className="space-y-4 mt-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold">
                      Solicitud N°{" "}
                      {getSolicitudInicial(pqrsdData?.tipo_solicitud || "")}-
                      {pqrsdData?.numero_radicado || ""}
                    </h2>

                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <Button variant="outline" onClick={handleSave}>
                          Guardar Cambios
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={handleEditClick}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Información
                        </Button>
                      )}
                      <ActionMenu pqrsd={id} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          Número de Radicado
                        </label>
                        <Input
                          value={pqrsdData.numero_radicado || ""}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Asunto de la Solicitud
                        </label>
                        <Input
                          value={pqrsdData.asunto_solicitud || ""}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setPqrsdData({ ...pqrsdData, asunto_solicitud: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tipo</label>
                        <Input
                          value={pqrsdData.tipo_solicitud || ""}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setPqrsdData({ ...pqrsdData, tipo_solicitud: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Estado</label>
                        <Input value={pqrsdData.estado || ""} readOnly
                          onChange={(e) =>
                            setPqrsdData({ ...pqrsdData, estado: e.target.value })
                          }
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Motivo</label>
                        <Input value={pqrsdData.motivo || ""} 
                          disabled={!isEditing}
                          onChange={(e) =>
                            setPqrsdData({ ...pqrsdData, motivo: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Fecha Radicado
                        </label>
                        <Input
                          value={
                            new Date(
                              pqrsdData.fecha_radicado
                            ).toLocaleDateString() || ""
                          }
                          onChange={(e) =>
                            setPqrsdData({ ...pqrsdData, fecha_radicado: e.target.value })
                          }
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Medio de Radicación
                        </label>
                        <Input
                          value={pqrsdData.medio_radicacion || ""}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setPqrsdData({ ...pqrsdData, medio_radicacion: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Fecha Inicio
                        </label>
                        <Input
                          value={
                            new Date(
                              pqrsdData.created_at
                            ).toLocaleDateString() || ""
                          }
                          onChange={(e) =>
                            setPqrsdData({ ...pqrsdData, created_at: e.target.value })
                          }
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
                    <h2 className="text-xl font-semibold">
                      Datos del Solicitante
                    </h2>
                    <ActionMenu />
                  </div>
                  <SolicitanteForm />
                </TabsContent>
                <TabsContent value="documentos" className="mt-6">
                  <Formdocument />
                </TabsContent>
                <TabsContent value="observaciones" className="mt-6">
                  <Observationsmanagment />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}

export default EditGestion;