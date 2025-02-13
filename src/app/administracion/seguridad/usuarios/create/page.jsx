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
import { toast } from 'sonner';
const initialFormData = {
    username: "",
    empleado_id: "",
    persona: "",
    email: "",
    password: "",
    fecha_expiracion: "",
    is_admin: "",
    estado: "",
};

export function CreateUsuario({ onSuccess }) {
    const [open, setOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState(initialFormData);

    const fetchRolesAndEmpleados = async () => {
        try {
            const token = localStorage.getItem("token");

            const rolesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRoles(rolesResponse.data.data || []);

            const empleadosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/users/empleados`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmpleados(empleadosResponse.data.data || []);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchRolesAndEmpleados();
    }, []);

    const resetStates = () => {
        setFormData(initialFormData);
        setErrors({});
        setSearchTerm("");
    };

    const handleOpenChange = (newOpen) => {
        if (!newOpen) {
            resetStates();
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

    const handleEmpleadoChange = (value) => {
        const selectedEmpleado = empleados.find(emp => emp.id === value);
        if (selectedEmpleado) {
            setFormData({
                ...formData,
                empleado_id: value,
                persona: `${selectedEmpleado.nombre_1} ${selectedEmpleado.nombre_2 || ''} ${selectedEmpleado.apellido_1} ${selectedEmpleado.apellido_2}`.trim(),
                email: selectedEmpleado.correo,
            });
        } else {
            setFormData({
                ...formData,
                empleado_id: "",
                persona: "",
                email: "",
            });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/administracion/users`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success("Usuario creado exitosamente");
            await fetchRolesAndEmpleados(); // Refrescar la lista de empleados
            onSuccess?.();
            setFormData(initialFormData);
            setOpen(false);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const validationErrors = error.response.data.errors;
                setErrors(validationErrors);

                if (validationErrors.username) {
                    toast.error("Este nombre de usuario ya está registrado.");
                }

                Object.entries(validationErrors).forEach(([field, messages]) => {
                    if (field !== 'username') {
                        toast.error(messages[0]);
                    }
                });
            } else {
                console.error('Error al guardar el usuario:', error);
                toast.error(`Error al guardar el usuario: ${error.response?.data?.message || 'Error en la creación del usuario'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredEmpleados = empleados.filter((empleado) => {
        const fullName = `${empleado.nombre_1} ${empleado.nombre_2} ${empleado.apellido_1} ${empleado.apellido_2}`;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Usuario
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Crear Usuario</DialogTitle>
                    <DialogDescription>
                        Por favor, completa los campos necesarios para registrar un nuevo usuario.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4 grid-cols-2">
                    {/* Username */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            className={errors.username ? "border-red-500" : ""}
                        />
                        {errors.username && (
                            <div className="text-red-500 mt-1 text-sm">{errors.username}</div>
                        )}
                    </div>

                    {/* Empleado Selection */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="empleado_id">Empleado Disponible</Label>
                        <Select name="empleado_id" onValueChange={handleEmpleadoChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Campo de búsqueda */}
                                <div className="p-2">
                                    <Input
                                        type="text"
                                        placeholder="Buscar empleado"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="mb-2"
                                    />
                                </div>

                                {/* Lista filtrada de empleados */}
                                {filteredEmpleados.map((empleado) => (
                                    <SelectItem key={empleado.id} value={empleado.id}>
                                        {`${empleado.nombre_1} ${empleado.nombre_2 || ''} ${empleado.apellido_1} ${empleado.apellido_2}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Nombre del empleado */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="persona">Nombre del empleado</Label>
                        <Input
                            id="persona"
                            name="persona"
                            value={formData.persona}
                            readOnly
                        />
                    </div>

                    {/* Email */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            readOnly
                        />
                    </div>

                    {/* Password */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                        />
                    </div>

                    {/* Fecha Expiración */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="fecha_expiracion">Fecha Expiracion</Label>
                        <Input
                            id="fecha_expiracion"
                            name="fecha_expiracion"
                            type="date"
                            value={formData.fecha_expiracion}
                            onChange={(e) => handleChange("fecha_expiracion", e.target.value)}
                        />
                    </div>

                    {/* Is Admin */}
                    <div className="grid items-center gap-4">
                        <Label htmlFor="is_admin">Administrador</Label>
                        <Select name="is_admin" onValueChange={(value) => handleChange("is_admin", value === "true")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione si es admin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Sí</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                        </Select>
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
            </DialogContent>
        </Dialog>
    );
}