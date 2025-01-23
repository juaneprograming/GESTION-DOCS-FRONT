import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2 } from "lucide-react";

export function EditEmpleado({ empleadoId }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        nombre_1: "",
        nombre_2: "",
        apellido_1: "",
        apellido_2: "",
        tipo_identificacion: "",
        numero_identificacion: "",
        correo: "",
        telefono: "",
        cargo_id: "",
        sede_id: "",
        area_id: ""
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                // Fetch employee data
                const empleadoRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados/${empleadoId}`, config);
                // console.log('Empleado Data:', empleadoRes.data); // Aquí verificamos que esté trayendo datos
                if (empleadoRes.data) {
                    setFormData(empleadoRes.data);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [empleadoId]);


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
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados/${empleadoId}`,
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
            alert("Empleado actualizado exitosamente");
        } catch (error) {
            console.error("Error updating employee:", error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert(error.response?.data?.message || "Error al actualizar el empleado");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Editar Empleado</DialogTitle>
                    <DialogDescription>
                        Modifica los campos necesarios para actualizar la información del empleado.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 grid-cols-2">
                    <div className="grid items-center gap-4">
                        <Label htmlFor="nombre_1">Nombre 1 *</Label>
                        <Input
                            id="nombre_1"
                            value={formData.nombre_1 || ""}
                            onChange={(e) => handleChange("nombre_1", e.target.value)}
                            className={errors.nombre_1 ? "border-red-500" : ""}
                        />
                        {errors.nombre_1 && <span className="text-red-500 text-sm">{errors.nombre_1}</span>}
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
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
