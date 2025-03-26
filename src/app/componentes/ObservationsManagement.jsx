"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { ActionMenu } from "@/app/componentes/actionmenu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

export default function ObservationsManagement({ pqrsdId }) {
    const searchParams = useSearchParams();
    const id = searchParams.get('id'); // ID del PQRSD
    const [observaciones, setObservaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedObservacion, setSelectedObservacion] = useState(null);
    const [isAdjuntosOpen, setIsAdjuntosOpen] = useState(false);
    const [adjuntos, setAdjuntos] = useState([]);

    // Función para cargar las observaciones
    const fetchObservaciones = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${id}/observaciones`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    withCredentials: true
                }
            );
            setObservaciones(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (err) {
            setError('Error al cargar las observaciones');
            console.error('Error al cargar las observaciones:', err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para cargar los adjuntos de una observación
    const fetchAdjuntos = async (observacionId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/observaciones/${observacionId}/adjuntos`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                }
            );
            setAdjuntos(response.data);
        } catch (err) {
            console.error('Error al cargar adjuntos:', err.response ? err.response.data : err.message);
            setAdjuntos([]);
        }
    };

    // Efecto para cargar las observaciones al montar el componente
    useEffect(() => {
        fetchObservaciones();
    }, [id]);

    // Función para abrir el modal de adjuntos
    const showAdjuntos = (observacion) => {
        setSelectedObservacion(observacion);
        fetchAdjuntos(observacion.id);
        setIsAdjuntosOpen(true);
    };

    // Función para descargar un documento
    const handleDownload = async (filename) => {
        if (!selectedObservacion || !filename) {
            console.error("ID de observación o nombre de archivo no válido.");
            alert("Error: No se pudo identificar el archivo a descargar.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/observaciones/${selectedObservacion.id}/descargar/${filename}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob", // Importante para manejar archivos binarios
                }
            );

            // Crear un enlace temporal para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error al descargar:", err.response ? err.response.data : err.message);
            alert("Error al descargar el documento.");
        }
    };

    // Renderizado condicional mientras se cargan los datos
    if (loading) return <div>Cargando observaciones...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Observaciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>FECHA</TableHead>
                                <TableHead>OBSERVACIÓN</TableHead>
                                <TableHead>DOCUMENTOS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {observaciones.length > 0 ? (
                                observaciones.map((observacion) => (
                                    <TableRow key={observacion.id}>
                                        <TableCell>{format(new Date(observacion.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                                        <TableCell>{observacion.descripcion}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => showAdjuntos(observacion)}>
                                                Ver Adjuntos
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-gray-500">
                                        No hay observaciones realizadas.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Dialog open={isAdjuntosOpen} onOpenChange={setIsAdjuntosOpen}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Documentos Adjuntos</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NOMBRE DEL ARCHIVO</TableHead>
                                    <TableHead>FORMATO</TableHead>
                                    <TableHead>VER</TableHead>
                                    <TableHead>DESCARGAR</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adjuntos.length > 0 ? (
                                    adjuntos.map((doc) => {
                                        const fileName = doc.nombre_documento;
                                        const fileFormat = fileName.split('.').pop();
                                        return (
                                            <TableRow key={doc.id}>
                                                <TableCell>{fileName}</TableCell>
                                                <TableCell>{fileFormat}</TableCell>
                                                <TableCell>
                                                    <a
                                                        href={doc.url} // Usar la URL de S3
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </a>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDownload(doc.nombre_documento)}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-gray-500">
                                            No hay documentos adjuntos.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}