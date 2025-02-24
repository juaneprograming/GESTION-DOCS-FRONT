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
  const [trazabilidad, setTrazabilidad] = useState([]);
  const id = searchParams.get("id");
  const entidad = searchParams.get('entidad') || "expediente";
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
  const [documentos, setDocumentos] = useState([]);

  const viewDocument = async (filename) => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(
        `${baseUrl}/expedientes/${id}/descargar/${filename}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob', // Importante para recibir el archivo binario
        }
      );

      // Crear un objeto Blob y su URL
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      // Abrir en una nueva pestaña
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error("Error al visualizar el documento:", error);
      toast.error("Error al visualizar el documento.");
    }
  };


  const downloadFile = async (filename) => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(
        `${baseUrl}/expedientes/${id}/descargar/${filename}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob', // Importante para recibir el archivo binario
        }
      );

      // Asegurar que el archivo tenga la extensión .pdf
      const fileExtension = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

      // Crear una URL para el archivo
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileExtension);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      toast.error("Error al descargar el archivo.");
    }
  };


  useEffect(() => {
    const fetchExpedienteAndDocuments = async () => {
      try {
        const token = localStorage.getItem("token");

        // Obtener el expediente
        const expedienteResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/expedientes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const expedienteData = expedienteResponse.data;

        // Obtener los documentos
        const documentosResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/${entidad}/${id}/documentos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const documentosData = documentosResponse.data.documentos;

        setExpedienteData(expedienteData);
        setEditedData({
          nombre_expediente: expedienteData.nombre_expediente || "",
          serie: expedienteData.serie || "",
          subserie: expedienteData.subserie || "",
        });
        setOriginalData({
          nombre_expediente: expedienteData.nombre_expediente || "",
          serie: expedienteData.serie || "",
          subserie: expedienteData.subserie || "",
        });
        await fetchTrazabilidad();
        setDocumentos(documentosData); // Guardar documentos en el estado
      } catch (err) {
        console.error("Error fetching expediente and documents:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExpedienteAndDocuments();
    else setLoading(false);
  }, [id]);

  const fetchTrazabilidad = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/expedientes/${id}/trazabilidad`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Datos de trazabilidad:', response.data);
      setTrazabilidad(response.data);
    } catch (error) {
      console.error("Error al obtener la trazabilidad:", error);
      toast.error("Error al cargar la trazabilidad del expediente");
    }
  };


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
                {trazabilidad.length === 0 ? (
                    <div className="text-center text-gray-500">No hay registros de trazabilidad</div>
                  ) : (
                    trazabilidad.map((item, index) => (
                      <div key={index} className="relative pl-6 pb-6 last:pb-0">
                        <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full" />
                        {index !== trazabilidad.length - 1 && (
                          <div className="absolute left-[5px] top-4 w-0.5 h-full bg-gray-200" />
                        )}
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleString()}
                          </div>
                          <div className="text-sm font-medium">
                            Usuario: {item.usuario ? item.usuario.username : 'Usuario no disponible'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Acción: {item.accion}
                          </div>
                          {item.descripcion && (
                            <div className="text-sm text-muted-foreground">
                              Descripción: {item.descripcion}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
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
              <div className="flex justify-end p-4">
                <UploadDocumentModal
                  expedienteId={id}
                  onUploadSuccess={(newDocumento) => {
                    setDocumentos([...documentos, newDocumento]);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md border-2 border-black hover:bg-blue-600 transition-colors"
                />
              </div>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre del documento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentos.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.nombre_documento}</TableCell>
                        <TableCell>{doc.nombre_original.split('.').pop().toUpperCase()}</TableCell>
                        <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{(doc.tamaño / 1024).toFixed(2)} KB</TableCell>
                        <TableCell>
                          <Button variant="ghost" onClick={() => viewDocument(doc.nombre_documento)}>
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button variant="ghost" onClick={() => downloadFile(doc.nombre_documento)}>
                            <Download className="h-4 w-4" />
                          </Button>
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