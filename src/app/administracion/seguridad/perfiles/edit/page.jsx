"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
import { Edit2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";


export function EditPerfil({ profileId, onSuccess }) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isFetchingProfile, setIsFetchingProfile] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        descripcion: "",
        estado: "",
    });

    const fetchProfileData = useCallback(async () => {
        setIsFetchingProfile(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token no encontrado. Inicia sesión nuevamente.");
            }

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/administracion/roles/${profileId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const profileData = response.data.data || response.data;
            setFormData({
                name: profileData.name || "",
                descripcion: profileData.descripcion || "",
                estado: profileData.estado ? "true" : "false",
            });
        } catch (err) {
            console.error("Error fetching profile data:", err);
            setErrors((prev) => ({
                ...prev,
                general: "Ocurrió un error al cargar los datos del perfil. Por favor, intenta de nuevo."
            }));
        } finally {
            setIsFetchingProfile(false);
        }
    }, [profileId]);

    useEffect(() => {
        if (open) {
            fetchProfileData();
        }
    }, [open, fetchProfileData]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [field]: undefined,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true); // Estado: "Guardando..."
        setErrors({});
        try {
            const token = localStorage.getItem("token");
            const payload = {
                name: formData.name,
                descripcion: formData.descripcion,
                estado: formData.estado === "true",
            };
    
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/administracion/roles/${profileId}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            toast.success("Perfil actualizado exitosamente");
            setOpen(false);
            if (onSuccess) onSuccess();
    
        } catch (error) {
            // Manejar error de nombre duplicado
            if (error.response?.status === 422) {
                toast.error("Este nombre ya está en uso");
                setErrors({ name: "Este nombre ya está en uso" });
            } else {
                toast.error("Error al actualizar el perfil");
            }
        } finally {
            setLoading(false); // Restablecer siempre el estado
        }
    };
    

    const handlePrefetch = useCallback(() => {
        if (!isFetchingProfile) {
            fetchProfileData();
        }
    }, [isFetchingProfile, fetchProfileData]);

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) setErrors({});
            }}
        >

            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onMouseEnter={handlePrefetch}
                    onTouchStart={handlePrefetch}
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogDescription>
                        Modifica los campos necesarios para actualizar la información del
                        perfil.
                    </DialogDescription>
                </DialogHeader>

                {isFetchingProfile ? (
                    <p className="text-center">Cargando datos...</p>
                ) : (
                    <div className="grid gap-4 py-4 grid-cols-2">
                        <div className="grid items-center gap-4">
                            <Label htmlFor="name">Nombre *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">{errors.name}</p>
                            )}
                        </div>

                        <div className="grid items-center gap-4">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Input
                                id="descripcion"
                                value={formData.descripcion}
                                onChange={(e) => handleChange("descripcion", e.target.value)}
                                className={errors.descripcion ? "border-red-500" : ""}
                            />
                            {errors.descripcion && (
                                <p className="text-red-500 text-sm">{errors.descripcion}</p>
                            )}
                        </div>

                        <div className="grid items-center gap-4">
                            <Label htmlFor="estado">Estado</Label>
                            <Select
                                value={formData.estado}
                                onValueChange={(e) => handleChange("estado", e)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Activo</SelectItem>
                                    <SelectItem value="false">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {errors.general && (
                    <p className="text-red-500 text-sm text-center">{errors.general}</p>
                )}

                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>

                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Guardando..." : "Actualizar"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
