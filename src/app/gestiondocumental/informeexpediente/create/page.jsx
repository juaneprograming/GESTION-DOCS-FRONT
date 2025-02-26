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
import { Textarea } from '@/components/ui/textarea';

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
            <Button variant="default" >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Expediente
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] md:max-w-[1000px]"> {/* Increased width for wider layout */}
            <DialogHeader>
                <DialogTitle>Crear Expediente</DialogTitle>
                <DialogDescription>
                    Por favor, completa los campos necesarios para crear un nuevo expediente.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
                {/* Primera fila - Nombre y Fecha */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <Label htmlFor="nombre_expediente">Nombre del Expediente</Label>
                        <Input
                            id="nombre_expediente"
                            value={formData.nombre_expediente}
                            onChange={(e) => handleChange('nombre_expediente', e.target.value)}
                            className={errors.nombre_expediente ? 'border-red-500' : ''}
                        />
                        {errors.nombre_expediente && (
                            <p className="text-red-500 text-sm">{errors.nombre_expediente}</p>
                        )}
                    </div>
                    <div className="col-span-1">
                        <Label htmlFor="fecha_expediente">Fecha de Creación</Label>
                        <Input
                            id="fecha_expediente"
                            type="date"
                            value={formData.fecha_expediente}
                            onChange={(e) => handleChange('fecha_expediente', e.target.value)}
                            className={errors.fecha_expediente ? 'border-red-500' : ''}
                        />
                        {errors.fecha_expediente && (
                            <p className="text-red-500 text-sm">{errors.fecha_expediente}</p>
                        )}
                    </div>
                </div>

                {/* Segunda fila - Serie y Subserie */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="serie">Serie Documental</Label>
                        <Input
                            id="serie"
                            value={formData.serie}
                            onChange={(e) => handleChange('serie', e.target.value)}
                            className={errors.serie ? 'border-red-500' : ''}
                        />
                        {errors.serie && (
                            <p className="text-red-500 text-sm">{errors.serie}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="subserie">Subserie Documental</Label>
                        <Input
                            id="subserie"
                            value={formData.subserie}
                            onChange={(e) => handleChange('subserie', e.target.value)}
                            className={errors.subserie ? 'border-red-500' : ''}
                        />
                        {errors.subserie && (
                            <p className="text-red-500 text-sm">{errors.subserie}</p>
                        )}
                    </div>
                </div>

                {/* Tercera fila - Dependencias y Estado */}
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <Label htmlFor="dependencia">Dependencia</Label>
                        <Input
                            id="dependencia"
                            value={formData.dependencia}
                            onChange={(e) => handleChange('dependencia', e.target.value)}
                            className={errors.dependencia ? 'border-red-500' : ''}
                        />
                        {errors.dependencia && (
                            <p className="text-red-500 text-sm">{errors.dependencia}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="dependencia_gestion">Dependencia de Gestión</Label>
                        <Input
                            id="dependencia_gestion"
                            value={formData.dependencia_gestion}
                            onChange={(e) => handleChange('dependencia_gestion', e.target.value)}
                            className={errors.dependencia_gestion ? 'border-red-500' : ''}
                        />
                        {errors.dependencia_gestion && (
                            <p className="text-red-500 text-sm">{errors.dependencia_gestion}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="estado">Estado del Expediente</Label>
                        <Input
                            id="estado"
                            value={formData.estado}
                            onChange={(e) => handleChange('estado', e.target.value)}
                            disabled
                            className="bg-gray-50"
                        />
                    </div>
                </div>

                {/* Cuarta fila - Descripción */}
                <div>
                    <Label htmlFor="descripcion">Descripción del Expediente</Label>
                    <Textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                        className={`min-h-[100px] ${errors.descripcion ? 'border-red-500' : ''}`}
                        placeholder="Ingrese una descripción detallada del expediente..."
                    />
                    {errors.descripcion && (
                        <p className="text-red-500 text-sm">{errors.descripcion}</p>
                    )}
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <Button className="border" variant="primary" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
    );
}
