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

    // Initial form state moved outside to allow easy reset
    const initialFormData = {
        nombre: "",
        nit: "",
        direccion: "",
        mision: "",
        vision: "",
        logo: null,
    };

    const [formData, setFormData] = useState(initialFormData);

    // Reset function to clear form and errors
    const resetForm = () => {
        setFormData(initialFormData);
        setErrors({});
    };

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
            
            setOpen(false);
            resetForm(); // Use reset function
            
            toast.success("Entidad creada exitosamente");
            
            if (onEntidadCreado) {
                try {
                    await onEntidadCreado();
                } catch (error) {
                    console.error("Error en onEntidadCreado:", error);
                }
            }
            
        } catch (error) {
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
        <Dialog 
            open={open} 
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                // Reset form when modal is closed and reopened
                if (!isOpen) {
                    resetForm();
                }
            }}
        >
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
                    {/* Nombre */}
                    <div className="grid items-center gap-1">
                        <Label htmlFor="nombre">Nombre *</Label>
                        <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => handleChange("nombre", e.target.value)}
                            className={`min-h-[40px] ${errors.nombre ? "border-red-500" : ""}`}
                        />
                        {errors.nombre ? (
                            <span className="text-red-500 text-sm">{errors.nombre}</span>
                        ) : <div className="h-5" />}
                    </div>

                    {/* NIT */}
                    <div className="grid items-center gap-1">
                        <Label htmlFor="nit">NIT *</Label>
                        <Input
                            id="nit"
                            value={formData.nit}
                            onChange={(e) => handleChange("nit", e.target.value)}
                            className={`min-h-[40px] ${errors.nit ? "border-red-500" : ""}`}
                        />
                        {errors.nit ? (
                            <span className="text-red-500 text-sm">{errors.nit}</span>
                        ) : <div className="h-5" />}
                    </div>

                    {/* Dirección */}
                    <div className="grid items-center gap-1 col-span-2">
                        <Label htmlFor="direccion">Dirección *</Label>
                        <Input
                            id="direccion"
                            value={formData.direccion}
                            onChange={(e) => handleChange("direccion", e.target.value)}
                            className={`min-h-[40px] ${errors.direccion ? "border-red-500" : ""}`}
                        />
                        {errors.direccion ? (
                            <span className="text-red-500 text-sm">{errors.direccion}</span>
                        ) : <div className="h-5" />}
                    </div>

                    {/* Misión */}
                    <div className="grid items-center gap-1 col-span-2">
                        <Label htmlFor="mision">Misión</Label>
                        <Textarea
                            id="mision"
                            value={formData.mision}
                            onChange={(e) => handleChange("mision", e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* Visión */}
                    <div className="grid items-center gap-1 col-span-2">
                        <Label htmlFor="vision">Visión</Label>
                        <Textarea
                            id="vision"
                            value={formData.vision}
                            onChange={(e) => handleChange("vision", e.target.value)}
                            className="min-h-[100px]"
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