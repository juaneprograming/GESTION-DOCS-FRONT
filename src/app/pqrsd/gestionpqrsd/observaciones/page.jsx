"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquarePlus } from "lucide-react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export function Observaciones({ onSuccess }) {
    const [open, setOpen] = useState(false);
    const searchParams = useSearchParams();
    const id = searchParams.get("id"); // ID del PQRSD
    const [errors, setErrors] = useState({});
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        descripcion: "",
    });

    // Manejar cambios en los campos de texto
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // Manejar cambios en los archivos adjuntos
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Validar el tamaño máximo de los archivos (2 MB)
        const maxFileSize = 2 * 1024 * 1024; // 2 MB
        const invalidFiles = selectedFiles.filter((file) => file.size > maxFileSize);

        if (invalidFiles.length > 0) {
            alert(`Uno o más archivos exceden el tamaño máximo permitido de 2 MB.`);
            return;
        }

        // Validar el formato de los archivos (solo PDF)
        const invalidFormats = selectedFiles.filter((file) => file.type !== "application/pdf");

        if (invalidFormats.length > 0) {
            alert("Solo se permiten archivos PDF.");
            return;
        }

        setFiles(selectedFiles);
    };

    // Enviar la observación
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const formDataToSend = new FormData();

            // Agregar descripción
            formDataToSend.append("descripcion", formData.descripcion);

            // Agregar archivos adjuntos
            files.forEach((file) => {
                formDataToSend.append("archivos[]", file);
            });

            // Llamar al endpoint para crear la observación
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${id}/observaciones`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            // Cerrar el modal y resetear el formulario
            setOpen(false);
            setFormData({ descripcion: "" });
            setFiles([]);
            setErrors({});

            // Ejecutar la función onSuccess si está definida
            if (onSuccess) onSuccess();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error al crear la observación:", error);
                alert("Ocurrió un error al crear la observación. Por favor, intenta nuevamente.");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <MessageSquarePlus className="h-4 w-4 mr-2" />
                    Nueva Observación
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <div className="p-6 bg-white">
                    <DialogHeader className="pb-4 mb-4 border-b border-gray-200">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            NUEVA OBSERVACIÓN
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        {/* Descripción */}
                        <div>
                            <Label htmlFor="descripcion" className="block mb-2 font-medium text-gray-700">
                                Descripción <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="descripcion"
                                rows={4}
                                placeholder="Ingrese una descripción detallada de la observación"
                                value={formData.descripcion}
                                onChange={(e) => handleChange("descripcion", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.descripcion && (
                                <div className="text-red-500 text-sm">{errors.descripcion[0]}</div>
                            )}
                        </div>

                        {/* Documento */}
                        <div>
                            <Label htmlFor="documento" className="block mb-2 font-medium text-gray-700">
                                Documento de soporte
                            </Label>
                            <input
                                type="file"
                                id="documento"
                                onChange={handleFileChange}
                                accept=".pdf"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                multiple
                            />
                            <small className="text-gray-500">Puedes subir varios documentos (PDF, máximo 2 MB).</small>
                            {errors.archivos && (
                                <div className="text-red-500 text-sm">{errors.archivos[0]}</div>
                            )}
                        </div>

                        {/* Botón de Guardar */}
                        <Button
                            onClick={handleSubmit}
                            className="w-full px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Guardar observación
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}