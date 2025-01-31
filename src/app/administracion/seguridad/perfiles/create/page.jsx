'use client';

import React, { useState, useEffect } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";

export function CreatePerfil({ onSuccess }) {
    const [open, setOpen] = useState(false);
    const [pefiles, setPerfiles] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        descripcion: "",
        estado: "",
    });

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/administracion/roles`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setPerfiles(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setErrors(error.message);
            }
        };

        fetchProfiles();
    }, []);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value, });
    };

    const handleSubmit = async () => {
        // Validar formulario
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/administracion/roles`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                }
            );
            setOpen(false);
            setFormData({
                name: "",
                descripcion: "",
                estado: "",
            });

            setErrors({});
            if (onSuccess) onSuccess();
            toast.success("Perfil creado exitosamente");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const validationErrors = error.response.data.errors;
                setErrors(validationErrors);
        
                // Limpiar errores después de 3 segundos (opcional)
                setTimeout(() => setErrors({}), 3000); 
        
                // Mostrar errores en toast
                Object.entries(validationErrors).forEach(([field, messages]) => {
                    toast.error(messages[0]);
                });
            } else {
                toast.error("Error al guardar el perfil");
            }
            setLoading(false); // Forzar restablecimiento
        }
    };



    const validateForm = () => {
        const requiredFields = ["name", "descripcion", "estado"];
        const newErrors = {};

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = "Este campo es requerido";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Perfil
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Crear Perfil</DialogTitle>
                    <DialogDescription>
                        Por favor, completa los campos necesarios para registrar un nuevo perfil.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4">
                    {/* Name */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="name" className="flex items-center">
                            Nombre <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                            <div className="text-red-500 text-sm">{errors.name}</div>
                        )}
                    </div>

                    {/* Descripcion */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="descripcion" className="flex items-center">
                            Descripcion <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => handleChange("descripcion", e.target.value)}
                            className={errors.descripcion ? "border-red-500" : ""}
                        />
                        {errors.descripcion && (
                            <div className="text-red-500 text-sm">{errors.descripcion}</div>
                        )}
                    </div>

                    {/* Estado */}
                    <div className="grid items-center gap-4">
                        <Label className="flex items-center">
                            Estado <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Select name="estado" onValueChange={(value) => handleChange("estado", value === "true")}>
                            <SelectTrigger className={errors.estado ? "border-red-500" : ""}>
                                <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Activo</SelectItem>
                                <SelectItem value="false">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.estado && (
                            <div className="text-red-500 text-sm">{errors.estado}</div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

}

