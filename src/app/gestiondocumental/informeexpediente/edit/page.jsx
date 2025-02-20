'use client';

import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/app/dashboard/layout";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/app/componentes/breadcrumb";
import { Button } from '@/components/ui/button';
import { Download, Eye, FileText, CalendarDays, File } from 'lucide-react';
import { CreateExpediente } from '../create/page';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit2 } from "lucide-react";
import { toast } from 'sonner';
import UploadDocumentModal from './uploadDocumentModal';

export function EditExpediente() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [expedienteData, setExpedienteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    nombre_expediente: "",
    serie: "",
    subserie: "",
  });
  const [originalData, setOriginalData] = useState({
    nombre_expediente: "",
    serie: "",
    subserie: "",
  });


  useEffect(() => {
    const fetchExpediente = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/expedientes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setExpedienteData(data);
        setEditedData({
          nombre_expediente: data.nombre_expediente || "",
          serie: data.serie || "",
          subserie: data.subserie || "",
        });
        setOriginalData({
          nombre_expediente: data.nombre_expediente || "",
          serie: data.serie || "",
          subserie: data.subserie || "",
        });
      } catch (err) {
        console.error("Error fetching expediente:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExpediente();
    else setLoading(false);
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const relevantFields = ['nombre_expediente', 'serie', 'subserie'];
    const hasChanges = relevantFields.some(
      field => editedData[field] !== originalData[field]
    );

    if (!hasChanges) {
      toast.info("No se han realizado cambios.");
      setIsEditing(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        nombre_expediente: editedData.nombre_expediente,
        serie: editedData.serie,
        subserie: editedData.subserie,
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/expedientes/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Expediente actualizado exitosamente");
      setOriginalData(editedData);
      setExpedienteData((prevData) => ({
        ...prevData,
        ...editedData,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el expediente:", error);
      toast.error("Error al actualizar el expediente.");
    }
  };

  const handleCancel = () => {
    setEditedData(originalData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">Cargando detalles del expediente...</div>
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

  const handleRefresh = () => setRefreshFlag((prev) => !prev);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-4xl font-semibold tracking-tight">Expediente</h2>
            <Breadcrumb />
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
            {/* Detalle de expediente */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <CardTitle>Detalle de expediente</CardTitle>
                </div>
                {isEditing ? (
                  <div>
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      Guardar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit2 className="h-4 w-4" />
                    Editar
                  </Button>
                )}
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {/* N° Expediente */}

                  <div className="text-sm font-medium">N° Expediente</div>
                  <div className="text-sm">{expedienteData.codigo_expediente}</div>

                  {/* Nombre */}
                  <div className="text-sm font-medium">Nombre</div>
                  <div className="text-sm">{expedienteData.nombre_expediente}</div>

                  {/* Serie */}
                  <div className="text-sm font-medium">Serie</div>
                  <div>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editedData.serie}
                        onChange={(e) => handleChange("serie", e.target.value)}
                      />
                    ) : (
                      <div className="text-sm">{expedienteData.serie}</div>
                    )}
                  </div>

                  {/* Subserie */}
                  <div className="text-sm font-medium">Subserie</div>
                  <div>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editedData.subserie}
                        onChange={(e) => handleChange("subserie", e.target.value)}
                      />
                    ) : (
                      <div className="text-sm">{expedienteData.subserie}</div>
                    )}
                  </div>

                  {/* Fecha inicio del expediente */}
                  <div className="text-sm font-medium">Fecha inicio del expediente</div>
                  <div className="text-sm">{expedienteData.fecha_expediente}</div>

                  {/* Dependencia */}
                  <div className="text-sm font-medium">Dependencia</div>
                  <div className="text-sm">{expedienteData.dependencia}</div>

                  {/* Usuario creador */}
                  <div className="text-sm font-medium">Usuario creador</div>
                  <div className="text-sm">aun no</div>

                  {/* Estado */}
                  <div className="text-sm font-medium">Estado</div>
                  <div className="text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${expedienteData.estado === 'Cerrado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                        }`}
                    >
                      {expedienteData.estado}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trazabilidad de expediente */}
            <Card>
              <CardHeader className="flex flex-row items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                <CardTitle>Trazabilidad de expediente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Estructura visual de la trazabilidad */}
                  {[
                    {
                      date: "2023-08-02 18:17:22",
                      user: "Hever Suarez",
                      department: "DEPENDENCIA JURIDICA",
                      observation: "Se cargó documento con el tipo documental anexos de forma individual al expediente",
                    },
                    {
                      date: "2023-08-02 18:03:19",
                      user: "Hever Suarez",
                      department: "DEPENDENCIA JURIDICA",
                      observation:
                        "Se excluyó (el)los siguiente(s) documento(s): 202399401018-8.pdf del expediente solicitudes 90",
                    },
                    {
                      date: "2023-08-02 17:55:02",
                      user: "Hever Suarez",
                      department: "DEPENDENCIA JURIDICA",
                      observation: "Se cargó documento con el tipo documental anexos de forma individual al expediente",
                    },
                  ].map((item, index) => (
                    <div key={index} className="relative pl-6 pb-6 last:pb-0">
                      <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full" />
                      {index !== 2 && <div className="absolute left-[5px] top-4 w-0.5 h-full bg-gray-200" />}
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">{item.date}</div>
                        <div className="text-sm font-medium">Usuario: {item.user}</div>
                        <div className="text-sm">Dependencia: {item.department}</div>
                        <div className="text-sm text-muted-foreground">Observación: {item.observation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader className="flex flex-row items-center space-x-2">
                <File className="w-5 h-5 text-blue-600" />
                <CardTitle>Documentos del expediente</CardTitle>
              </CardHeader>
              <UploadDocumentModal/>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre del documento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Estructura visual de los documentos */}
                    {[
                      {
                        name: "202399401018-1.pdf",
                        type: "PDF",
                        date: "2023-08-02",
                        size: "1.2 MB",
                      },
                      {
                        name: "202399401018-2.pdf",
                        type: "PDF",
                        date: "2023-08-02",
                        size: "842 KB",
                      },
                      {
                        name: "202399401018-3.pdf",
                        type: "PDF",
                        date: "2023-08-02",
                        size: "1.5 MB",
                      },
                    ].map((doc, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditExpediente />
    </Suspense>
  );
}