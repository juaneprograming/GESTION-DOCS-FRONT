'use client';

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

export function CreateCargo({ onSuccess }) {
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/administracion/cargos`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            toast.success("Cargo creado exitosamente");
            setOpen(false);
            setFormData({ nombre: "", descripcion: "" });
            if (onSuccess) onSuccess();

        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                // Mostrar errores en toast
                Object.values(error.response.data.errors).forEach(errorMessages => {
                    errorMessages.forEach(message => toast.error(message));
                });
            } else {
                toast.error(error.response?.data?.message || "Error al crear el cargo");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Cargo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Cargo</DialogTitle>
                    <DialogDescription>
                        Complete los datos para registrar un nuevo cargo en el sistema.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    {/* Nombre */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="nombre" className="flex items-center">
                            Nombre del cargo <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => handleChange("nombre", e.target.value)}
                            className={errors.nombre ? "border-red-500" : ""}
                        />
                        {errors.nombre && (
                            <div className="text-red-500 text-sm">{errors.nombre[0]}</div>
                        )}
                    </div>

                    {/* Descripción */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="descripcion" className="flex items-center">
                            Descripción <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => handleChange("descripcion", e.target.value)}
                            className={errors.descripcion ? "border-red-500" : ""}
                        />
                        {errors.descripcion && (
                            <div className="text-red-500 text-sm">{errors.descripcion[0]}</div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                        Guardar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}