'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';

const initialFormData = {
    codigo_expediente: '',
    nombre_expediente: '',
    fecha_expediente: '',
    serie: '',
    subserie: '',
    dependencia: '',
    dependencia_gestion: '',
    funcionario: '',
    descripcion: '',
    estado: 'Abierto'
};

export function CreateExpediente({ onSuccess }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleOpenChange = (newOpen) => {
        if (!newOpen) {
            setFormData(initialFormData);
            setErrors({});
        }
        setOpen(newOpen);
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/expedientes`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            // Verificar si la respuesta es exitosa
            if (response.status === 200 || response.status === 201) {
                toast.success('Expediente creado exitosamente');
                onSuccess?.();
                setFormData(initialFormData);
                setOpen(false);
            } else {
                toast.error('Error al guardar el expediente');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const validationErrors = error.response.data.errors;
                setErrors(validationErrors);
                Object.entries(validationErrors).forEach(([_ , messages]) => {
                    toast.error(messages[0]);
                });
            } else {
                toast.error('Error al guardar el expediente');
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Expediente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Crear Expediente</DialogTitle>
                    <DialogDescription>
                        Por favor, completa los campos necesarios para crear un nuevo expediente.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid items-center gap-2">
                        <Label htmlFor="codigo_expediente">Código del Expediente</Label>
                        <Input
                            id="codigo_expediente"
                            name="codigo_expediente"
                            value={formData.codigo_expediente}
                            onChange={(e) => handleChange('codigo_expediente', e.target.value)}
                            className={errors.codigo_expediente ? 'border-red-500' : ''}
                        />
                        {errors.codigo_expediente && (
                            <div className="text-red-500 text-sm">{errors.codigo_expediente}</div>
                        )}
                    </div>

                    <div className="grid items-center gap-2">
                        <Label htmlFor="nombre_expediente">Nombre del Expediente</Label>
                        <Input
                            id="nombre_expediente"
                            name="nombre_expediente"
                            value={formData.nombre_expediente}
                            onChange={(e) => handleChange('nombre_expediente', e.target.value)}
                            className={errors.nombre_expediente ? 'border-red-500' : ''}
                        />
                        {errors.nombre_expediente && (
                            <div className="text-red-500 text-sm">{errors.nombre_expediente}</div>
                        )}
                    </div>

                    <div className="grid items-center gap-2">
                        <Label htmlFor="fecha_expediente">Fecha del Expediente</Label>
                        <Input
                            id="fecha_expediente"
                            name="fecha_expediente"
                            type="date"
                            value={formData.fecha_expediente}
                            onChange={(e) => handleChange('fecha_expediente', e.target.value)}
                            className={errors.fecha_expediente ? 'border-red-500' : ''}
                        />
                        {errors.fecha_expediente && (
                            <div className="text-red-500 text-sm">{errors.fecha_expediente}</div>
                        )}
                    </div>

                    <div className="grid items-center gap-2">
                        <Label htmlFor="serie">Serie</Label>
                        <Input
                            id="serie"
                            name="serie"
                            value={formData.serie}
                            onChange={(e) => handleChange('serie', e.target.value)}
                            className={errors.serie ? 'border-red-500' : ''}
                        />
                        {errors.serie && (
                            <div className="text-red-500 text-sm">{errors.serie}</div>
                        )}
                    </div>

                    <div className="grid items-center gap-2">
                        <Label htmlFor="subserie">Subserie</Label>
                        <Input
                            id="subserie"
                            name="subserie"
                            value={formData.subserie}
                            onChange={(e) => handleChange('subserie', e.target.value)}
                            className={errors.subserie ? 'border-red-500' : ''}
                        />
                        {errors.subserie && (
                            <div className="text-red-500 text-sm">{errors.subserie}</div>
                        )}
                    </div>

                    <div className="grid items-center gap-2">
                        <Label htmlFor="dependencia">Dependencia</Label>
                        <Input
                            id="dependencia"
                            name="dependencia"
                            value={formData.dependencia}
                            onChange={(e) => handleChange('dependencia', e.target.value)}
                            className={errors.dependencia ? 'border-red-500' : ''}
                        />
                        {errors.dependencia && (
                            <div className="text-red-500 text-sm">{errors.dependencia}</div>
                        )}
                    </div>

                    <div className="grid items-center gap-2">
                        <Label htmlFor="dependencia_gestion">Dependencia Gestión</Label>
                        <Input
                            id="dependencia_gestion"
                            name="dependencia_gestion"
                            value={formData.dependencia_gestion}
                            onChange={(e) => handleChange('dependencia_gestion', e.target.value)}
                            className={errors.dependencia_gestion ? 'border-red-500' : ''}
                        />
                        {errors.dependencia_gestion && (
                            <div className="text-red-500 text-sm">{errors.dependencia_gestion}</div>
                        )}
                    </div>

                    <div className="grid items-center gap-2">
                        <Label htmlFor="funcionario">Funcionario</Label>
                        <Input
                            id="funcionario"
                            name="funcionario"
                            value={formData.funcionario}
                            onChange={(e) => handleChange('funcionario', e.target.value)}
                            className={errors.funcionario ? 'border-red-500' : ''}
                        />
                        {errors.funcionario && (
                            <div className="text-red-500 text-sm">{errors.funcionario}</div>
                        )}
                    </div>

                    <div className="grid items-center gap-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Input
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => handleChange('descripcion', e.target.value)}
                            className={errors.descripcion ? 'border-red-500' : ''}
                        />
                        {errors.descripcion && (
                            <div className="text-red-500 text-sm">{errors.descripcion}</div>
                        )}
                    </div>

                    <div className="grid items-center gap-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Input
                            id="estado"
                            name="estado"
                            value={formData.estado}
                            onChange={(e) => handleChange('estado', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
