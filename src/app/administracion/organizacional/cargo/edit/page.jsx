'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Pencil } from "lucide-react";
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

export function EditCargo({ cargoId, onSuccess }) {
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [isFetching, setIsFetching] = useState(true);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
    });

    const fetchCargoData = useCallback(async () => {
        setIsFetching(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token no encontrado");
            }

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/administracion/cargos/${cargoId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const cargoData = response.data.data || response.data;
            setFormData({
                nombre: cargoData.nombre || "",
                descripcion: cargoData.descripcion || "",
            });
        } catch (err) {
            console.error("Error fetching cargo data:", err);
            setErrors(prev => ({
                ...prev,
                general: "Error al cargar los datos del cargo"
            }));
        } finally {
            setIsFetching(false);
        }
    }, [cargoId]);

    // Actualizar datos al abrir el modal
    useEffect(() => {
        if (open && cargoId) {
            fetchCargoData();
        }
    }, [open, cargoId, fetchCargoData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setErrors(prev => ({
            ...prev,
            [field]: undefined,
            general: undefined
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token no encontrado");

            const payload = {
                nombre: formData.nombre,
                descripcion: formData.descripcion
            };

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/administracion/cargos/${cargoId}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success("Cargo actualizado exitosamente"); // Toast de éxito
            if (onSuccess) onSuccess();
            setOpen(false);

        } catch (error) {
            console.error("Error updating cargo:", error);
            
            // Manejo de errores de validación
            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                setErrors(validationErrors);
                
                // Mostrar toast para error de nombre duplicado
                if (validationErrors.nombre) {
                    toast.error(validationErrors.nombre[0]); 
                }
                
            } else {
                const errorMsg = error.response?.data?.message || "Error al actualizar el cargo";
                toast.error(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e, type) => {
        if (type === 'letter' && !/[a-zA-Z]/.test(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Editar Cargo</DialogTitle>
                    <DialogDescription>
                        Modifique los datos del cargo seleccionado.
                    </DialogDescription>
                </DialogHeader>

                {isFetching ? (
                    <div className="text-center">Cargando...</div>
                ) : (
                    <div className="grid gap-4 py-4">
                        {/* Campo Nombre */}
                        <div className="grid items-center gap-4">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                id="nombre"
                                value={formData.nombre}
                                onChange={(e) => handleChange("nombre", e.target.value)}
                                disabled={loading}
                                
                            />
                            {errors.nombre && (
                                <div className="text-red-500 text-sm">{errors.nombre[0]}</div>
                            )}
                        </div>

                        {/* Campo Descripción */}
                        <div className="grid items-center gap-4">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Input
                                id="descripcion"
                                value={formData.descripcion}
                                onChange={(e) => handleChange("descripcion", e.target.value)}
                                disabled={loading}
                                
                            />
                            {errors.descripcion && (
                                <div className="text-red-500 text-sm">{errors.descripcion[0]}</div>
                            )}
                        </div>

                        {/* Error general */}
                        {errors.general && (
                            <div className="text-red-500 text-sm text-center">
                                {errors.general}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || isFetching}
                    >
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}