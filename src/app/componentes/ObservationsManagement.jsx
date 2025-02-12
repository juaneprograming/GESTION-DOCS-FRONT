"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import { ActionMenu } from "@/app/componentes/actionmenu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import axios from "axios"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"

export default function ObservationsManagement({ pqrsdId }) {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const [observaciones, setObservaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedObservacion, setSelectedObservacion] = useState(null);
    const [isAdjuntosOpen, setIsAdjuntosOpen] = useState(false);
    const [adjuntos, setAdjuntos] = useState([]);
    const [authUser, setAuthUser] = useState([]);

    const fetchObservaciones = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/observaciones/${id}`,
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

    useEffect(() => {
        const fetchAuthUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/administracion/users`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    }
                );
                setAuthUser(response.data);
            } catch (err) {
                console.error('Error cargando usuario:', err);
            }
        };
        
        fetchAuthUser();
    }, []);

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

    useEffect(() => {
        fetchObservaciones();
    }, [id]);

    const showAdjuntos = (observacion) => {
        setSelectedObservacion(observacion);
        fetchAdjuntos(observacion.id);
        setIsAdjuntosOpen(true);
    };

    const handleDownload = async (filename) => {
        if (!selectedObservacion) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/observaciones/${selectedObservacion.id}/descargar/${filename}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    responseType: 'blob'
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error al descargar:', err.response ? err.response.data : err.message);
            alert('Error al descargar el documento');
        }
    };

    if (loading) return <div>Cargando observaciones...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Observaciones</h2>
                <ActionMenu pqrsd={{ id: pqrsdId }} handleRefresh={fetchObservaciones} />
            </div>

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
                            {observaciones.map((observacion) => (
                                <TableRow key={observacion.id}>
                                    <TableCell>{format(new Date(observacion.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                                    <TableCell>{observacion.descripcion}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => showAdjuntos(observacion)}>
                                            Ver Adjuntos
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                        </TableBody>
                    </Table>
                    <p className="text-gray-500 mt-8 text-center">No hay observaciones realizadas.</p>
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
                                {adjuntos.map((doc, index) => {
                                    const fileName = doc.split('/').pop();
                                    const fileFormat = fileName.split('.').pop();
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{fileName}</TableCell>
                                            <TableCell>{fileFormat}</TableCell>
                                            <TableCell>
                                                <a
                                                    href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${doc}`}
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
                                                    onClick={() => handleDownload(fileName)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                    
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}