"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import { ActionMenu } from "@/app/componentes/actionmenu"

export default function ObservationsManagement() {
    // Ejemplo de datos - reemplazar con datos reales
    const observations = [
        {
            id: 1,
            task: "Revisión de documentos",
            user: "Juan Pérez",
            date: "2024-01-29",
            observation: "Pendiente de aprobación",
            attachments: 2,
        },
        // Más observaciones aquí
    ]

    const attachedDocuments = [
        {
            id: 1,
            name: "Documento1.pdf",
            format: "PDF",
        },
        // Más documentos aquí
    ]

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Observaciones</h2>
                <ActionMenu />
            </div>


            <Card>
                <CardHeader>
                    <CardTitle>Lista de Observaciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>TAREA</TableHead>
                                <TableHead>USUARIO</TableHead>
                                <TableHead>FECHA</TableHead>
                                <TableHead>OBSERVACIÓN</TableHead>
                                <TableHead>CANTIDAD ADJUNTOS</TableHead>
                                <TableHead>ACCIONES</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {observations.map((observation) => (
                                <TableRow key={observation.id}>
                                    <TableCell>{observation.task}</TableCell>
                                    <TableCell>{observation.user}</TableCell>
                                    <TableCell>{observation.date}</TableCell>
                                    <TableCell>{observation.observation}</TableCell>
                                    <TableCell>{observation.attachments}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                Ver
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Editar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Documentos Adjuntos</CardTitle>
                </CardHeader>
                <CardContent>
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
                            {attachedDocuments.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell>{doc.name}</TableCell>
                                    <TableCell>{doc.format}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

