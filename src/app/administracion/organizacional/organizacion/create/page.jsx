import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from 'sonner';

export function CreateEntidad({ onEntidadCreado }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        nombre: "",
        nit: "",
        direccion: "",
        mision: "",
        vision: "",
        logo: null,
    });

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
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/administracion/entidades`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    withCredentials: true,
                }
            );
            
            // Éxito: Cualquier código 2xx
            setOpen(false);
            setFormData({
                nombre: "",
                nit: "",
                direccion: "",
                mision: "",
                vision: "",
            });
            
            toast.success("Entidad creada exitosamente");
            
            // Ejecutar callback y manejar posibles errores internos
            if (onEntidadCreado) {
                try {
                    await onEntidadCreado();
                } catch (error) {
                    console.error("Error en onEntidadCreado:", error);
                    // Opcional: Mostrar toast específico si es necesario
                }
            }
            
        } catch (error) {
            // Manejo de errores de la petición
            const errorMessage = error.response?.data?.message || "Error desconocido al crear la entidad";
            toast.error(`Error al crear la entidad: ${errorMessage}`);
            
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-black hover:bg-gray-800 text-white">
                    <Plus className="h-4 w-4" />
                    Nueva Entidad
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Crear Entidad</DialogTitle>
                    <DialogDescription>
                        Por favor, completa los campos necesarios para registrar una nueva
                        entidad.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 grid-cols-2">
                    <div className="grid items-center gap-4">
                        <Label htmlFor="nombre">Nombre *</Label>
                        <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => handleChange("nombre", e.target.value)}
                            className={errors.nombre ? "border-red-500" : ""}
                        />
                        {errors.nombre && (
                            <span className="text-red-500 text-sm">{errors.nombre}</span>
                        )}
                    </div>
                    <div className="grid items-center gap-4">
                        <Label htmlFor="nit">NIT *</Label>
                        <Input
                            id="nit"
                            value={formData.nit}
                            onChange={(e) => handleChange("nit", e.target.value)}
                            className={errors.nit ? "border-red-500" : ""}
                        />
                        {errors.nit && (
                            <span className="text-red-500 text-sm">{errors.nit}</span>
                        )}
                    </div>
                    <div className="grid items-center gap-4 col-span-2">
                        <Label htmlFor="direccion">Dirección *</Label>
                        <Input
                            id="direccion"
                            value={formData.direccion}
                            onChange={(e) => handleChange("direccion", e.target.value)}
                            className={errors.direccion ? "border-red-500" : ""}
                        />
                        {errors.direccion && (
                            <span className="text-red-500 text-sm">{errors.direccion}</span>
                        )}
                    </div>
                    <div className="grid items-center gap-4 col-span-2">
                        <Label htmlFor="mision">Misión</Label>
                        <Textarea
                            id="mision"
                            value={formData.mision}
                            onChange={(e) => handleChange("mision", e.target.value)}
                        />
                    </div>
                    <div className="grid items-center gap-4 col-span-2">
                        <Label htmlFor="vision">Visión</Label>
                        <Textarea
                            id="vision"
                            value={formData.vision}
                            onChange={(e) => handleChange("vision", e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}