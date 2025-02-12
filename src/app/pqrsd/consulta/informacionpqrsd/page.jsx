"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Download, MessageSquarePlus, Edit, Plus } from "lucide-react";
import { ActionMenu } from "../../../componentes/actionmenu";
import { GestorForm } from "../../../componentes/gestorform";
import { SolicitanteForm } from "../../../componentes/solicitanteform";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,  
} from "@/components/ui/tooltip";
import DashboardLayout from "@/app/dashboard/layout";
import axios from "axios";
import { useEffect, useState, Suspense } from "react";
import { SolicitanteFormConsulta } from "@/app/componentes/solicitanteformconsulta";
import { Breadcrumb } from "@/app/componentes/breadcrumb";
import { useSearchParams } from "next/navigation";

// Nuevo componente separado para manejar useSearchParams
function PqrsdDataLoader({ onDataLoaded }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  useEffect(() => {
    console.log("ID recibido:", id);
  }, [id]);

  useEffect(() => {
    const fetchPQRSD = async () => {
      if (!id) return;
      
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
        onDataLoaded(response.data);
      } catch (err) {
        console.error("Error fetching PQRSD:", err);
      }
    };

    fetchPQRSD();
  }, [id, onDataLoaded]);

  return null; // Este componente no renderiza nada, solo maneja la carga de datos
}

export function EditGestion() {
  const [pqrsdData, setPqrsdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDataLoaded = (data) => {
    setPqrsdData(data);
    setLoading(false);
  };

  return (
    <Suspense fallback={<div>Cargando información...</div>}>
      <PqrsdDataLoader onDataLoaded={handleDataLoaded} />

      <DashboardLayout>
        {loading ? (
          <div className="p-6">Cargando detalles de la PQRSD...</div>
        ) : error ? (
          <div className="p-6">Error: {error}</div>
        ) : (
          <TooltipProvider>
            <div className="container mx-auto p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  INFORMACIÓN PQRSD
                </h1>
                <Breadcrumb />
              </div>

              {/* Main Content */}
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="solicitud" className="w-full">
                    <TabsList>
                      <TabsTrigger value="solicitud">
                        Número de la Solicitud
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
                          Solicitud N° {pqrsdData?.numero_radicado || ""}
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
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="solicitante" className="mt-6">
                      <h2 className="text-xl font-semibold">
                        Datos del Solicitante
                      </h2>
                      <SolicitanteFormConsulta />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TooltipProvider>
        )}
      </DashboardLayout>
    </Suspense>
  );
}

export default EditGestion;
