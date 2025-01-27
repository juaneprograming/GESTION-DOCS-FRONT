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

export function CreatePerfil({ onSuccess }) {
    const [open, setOpen] = useState(false);
    const [pefiles, setPerfiles] = useState([]);
    const [errors, setErrors] = useState([]);

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
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
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
            setOpen(false);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data);
            } else {
                console.log('Errot saving profile:', error);
            }
        }
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
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                        {errors.name && (
                            <div className="text-red-500 text-sm">{errors.name[0]}</div>
                        )}
                    </div>

                    {/* Descripcion */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="descripcion">Descripcion</Label>
                        <Input
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => handleChange("descripcion", e.target.value)}
                        />
                        {errors.descripcion && (
                            <div className="text-red-500 text-sm">{errors.descripcion[0]}</div>
                        )}
                    </div>

                    {/* Estado */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="estado">Estado</Label>
                        <Select name="estado" onValueChange={(value) => handleChange("estado", value === "true")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Activo</SelectItem>
                                <SelectItem value="false">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

}

