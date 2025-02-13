"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import DashboardLayout from "@/app/dashboard/layout";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState, Suspense } from "react";
import { SolicitanteFormConsulta } from "@/app/componentes/solicitanteformconsulta";
import { Breadcrumb } from "@/app/componentes/breadcrumb";

export function EditGestion() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [pqrsdData, setPqrsdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    console.log("ID recibido:", id);
  }, [id]);

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
            <h1 className="text-2xl font-semibold tracking-tight">
              INFORMACION PQRSD
            </h1>
            <Breadcrumb />
          </div>

          {/* Status Indicators */}
          <div className="flex justify-center items-center gap-4 py-4">
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
            <CardContent className="p-6">
              <Tabs defaultValue="solicitud" className="w-full">
                <TabsList>
                  <TabsTrigger value="solicitud">
                    Numero de la Solicitud
                  </TabsTrigger>
                  <TabsTrigger value="solicitante">
                    Datos del Solicitante
                  </TabsTrigger>
                  <TabsTrigger value="documentos">Documentos</TabsTrigger>
                  <TabsTrigger value="traza">Traza</TabsTrigger>
                </TabsList>

                <TabsContent value="solicitud" className="space-y-4 mt-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold">
                      Solicitud N°{" "}
                      {getSolicitudInicial(pqrsdData?.tipo_solicitud || "")}-
                      {pqrsdData?.numero_radicado || ""}
                    </h2>
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
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tipo</label>
                        <Input
                          value={pqrsdData.tipo_solicitud || ""}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Estado</label>
                        <Input value={pqrsdData.estado || ""} readOnly />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Motivo</label>
                        <Input value={pqrsdData.motivo || ""} readOnly />
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
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Medio de Radicación
                        </label>
                        <Input
                          value={pqrsdData.medio_radicacion || ""}
                          readOnly
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
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="solicitante" className="mt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">
                      Datos del Solicitante
                    </h2>
                  </div>
                  <SolicitanteFormConsulta />
                </TabsContent>
                <TabsContent value="documentos" className="mt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">Documentos</h2>
                  </div>
                  <div className="p-4 text-center text-muted-foreground">
                    Contenido de Documentos
                  </div>
                </TabsContent>
                <TabsContent value="traza" className="mt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">Traza</h2>
                  </div>
                  <div className="p-4 text-center text-muted-foreground">
                    Contenido de la Traza
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditGestion />
    </Suspense>
  );
}
