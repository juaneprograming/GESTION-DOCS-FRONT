import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

const AsignarUsuarios = ({ onBack }) => {
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Función para obtener usuarios desde la API
    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/administracion/users/empleados-con-usuario`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const formattedUsuarios = response.data.data.map((user) => ({
                    id: user.id,
                    nombreCompleto: `${user.empleado.nombre_1} ${user.empleado.nombre_2 || ""} ${user.empleado.apellido_1} ${user.empleado.apellido_2 || ""}`.trim(),
                    seleccionado: false,
                }));
                setUsuarios(formattedUsuarios);
            } catch (error) {
                console.error("Error obteniendo usuarios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsuarios();
    }, []);

    // Función para obtener roles desde la API
    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/administracion/roles`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setRoles(response.data.data);
            } catch (error) {
                console.error("Error obteniendo roles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();
    }, []);

    // Función para obtener usuarios con un rol específico
    const fetchUsersWithRole = async (roleId) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/administracion/roles/${roleId}/users`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return response.data.data; // Devuelve los usuarios con el rol asignado
        } catch (error) {
            console.error("Error obteniendo usuarios con el rol:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Manejar la selección de un rol
    const handleRoleSelection = async (value) => {
        const roleId = Number(value); // Convierte el valor a número
        setSelectedRoleId(roleId);

        if (roleId) {
            const usersWithRole = await fetchUsersWithRole(roleId);
            const userIdsWithRole = usersWithRole.map((user) => user.id);

            // Actualizar el estado de los usuarios
            setUsuarios((prevUsuarios) =>
                prevUsuarios.map((u) => ({
                    ...u,
                    seleccionado: userIdsWithRole.includes(u.id),
                }))
            );
        } else {
            // Si no hay un rol seleccionado, deseleccionar todos los usuarios
            setUsuarios((prevUsuarios) =>
                prevUsuarios.map((u) => ({ ...u, seleccionado: false }))
            );
        }
    };

    // Manejar la selección/deselección de todos los usuarios
    const handleSelectAll = (checked) => {
        setSelectAll(checked);
        setUsuarios((prevUsuarios) =>
            prevUsuarios.map((u) => ({ ...u, seleccionado: checked }))
        );
    };

    // Manejar la selección/deselección de un usuario individual
    const handleUsuarioSelection = (id, checked) => {
        setUsuarios((prevUsuarios) =>
            prevUsuarios.map((u) => (u.id === id ? { ...u, seleccionado: checked } : u))
        );
    };

    // Filtrar usuarios por término de búsqueda
    const filteredUsuarios = usuarios.filter((usuario) =>
        usuario.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Usuarios seleccionados
    const selectedUsers = usuarios.filter((u) => u.seleccionado);

    // Función para asignar roles
    const handleAssignRole = async () => {
        if (!selectedRoleId) {
            setMessage("Debes seleccionar un rol primero.");
            return;
        }

        setLoading(true);
        try {
            const userIds = selectedUsers.map((user) => user.id);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/administracion/assign-roles`,
                { user_ids: userIds, role_id: selectedRoleId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            console.log("Respuesta de la API:", response.data);

            if (response.status === 200) {
                setMessage(response.data.message);
            } else {
                throw new Error(response.data.message || "Error desconocido.");
            }
        } catch (error) {
            console.error("Error asignando rol:", error);
            setMessage(error.response?.data?.message || "No se pudo asignar el rol.");
        } finally {
            setLoading(false);
        }
    };

    // Función para desasignar roles
    const handleRemoveRole = async () => {
        if (!selectedRoleId) {
            setMessage("Debes seleccionar un rol primero.");
            return;
        }

        setLoading(true);
        try {
            const userIds = selectedUsers.map((user) => user.id);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/administracion/remove-roles`,
                { user_ids: userIds, role_id: selectedRoleId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            console.log("Respuesta de la API:", response.data);

            if (response.status === 200) {
                setMessage(response.data.message);
            } else {
                throw new Error(response.data.message || "Error desconocido.");
            }
        } catch (error) {
            console.error("Error desasignando rol:", error);
            setMessage(error.response?.data?.message || "No se pudo desasignar el rol.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex gap-6">
            {/* Left section */}
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Asignar usuarios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Role selection */}
                    <div className="space-y-2">
                        <Label>Selecciona un rol:</Label>
                        <Select value={selectedRoleId.toString()} onValueChange={handleRoleSelection}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.length === 0 ? (
                                    <p className="text-muted-foreground">No hay roles disponibles.</p>
                                ) : (
                                    roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id.toString()}>
                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Search input */}
                    <div className="space-y-2">
                        <Input
                            type="search"
                            placeholder="Buscar usuario por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Users list */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <Checkbox
                                id="select-all"
                                checked={selectAll}
                                onCheckedChange={handleSelectAll}
                            />
                            <Label htmlFor="select-all">Seleccionar/Deseleccionar todos</Label>
                        </div>
                        <div className="space-y-2 h-[180px] overflow-y-auto pr-4">
                            {loading ? (
                                <p className="text-muted-foreground">Cargando usuarios...</p>
                            ) : filteredUsuarios.length === 0 ? (
                                <p className="text-muted-foreground">No se encontraron usuarios.</p>
                            ) : (
                                filteredUsuarios.map((usuario) => (
                                    <div key={usuario.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`usuario-${usuario.id}`}
                                            checked={usuario.seleccionado}
                                            onCheckedChange={(checked) =>
                                                handleUsuarioSelection(usuario.id, checked)
                                            }
                                            disabled={loading}
                                        />
                                        <Label htmlFor={`usuario-${usuario.id}`}>
                                            {usuario.nombreCompleto}
                                        </Label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Right section */}
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Usuarios Seleccionados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="h-[400px] overflow-y-auto pr-4">
                            {selectedUsers.length === 0 ? (
                                <p className="text-muted-foreground">No hay usuarios seleccionados.</p>
                            ) : (
                                selectedUsers.map((usuario) => (
                                    <div key={usuario.id} className="py-2">
                                        {usuario.nombreCompleto}
                                    </div>
                                ))
                            )}
                        </div>
                        {/* Mensaje */}
                        <div className="mt-4">
                            {message && (
                                <p className="text-sm text-green-600">{message}</p>
                            )}
                        </div>
                        {/* Actions */}
                        <div className="space-y-2 mt-6">
                            <Button
                                className="w-full flex items-center justify-center gap-2"
                                variant="outline"
                                onClick={handleAssignRole}
                                disabled={loading || !selectedRoleId || selectedUsers.length === 0}
                            >
                                <Check className="h-4 w-4 text-green-700" />
                                Asignar rol
                            </Button>
                            <Button
                                className="w-full flex items-center justify-center gap-2"
                                variant="outline"
                                onClick={handleRemoveRole}
                                disabled={loading || !selectedRoleId || selectedUsers.length === 0}
                            >
                                <X className="h-4 w-4 text-red-700" />
                                Desasignar rol
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AsignarUsuarios;