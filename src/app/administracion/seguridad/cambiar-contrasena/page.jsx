"use client";

import DashboardLayout from "@/app/dashboard/layout";
import { Breadcrumb } from "@/app/componentes/breadcrumb";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

export default function CambiarContraseña() {
  const [users, setUsers] = useState([]); // Lista de usuarios desde la API
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState(""); // Nueva contraseña
  const [errors, setErrors] = useState({}); // Errores de validación

  // Obtener la lista de usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/administracion/passwordReset`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(response.data.data); // Asume que la respuesta tiene un formato { success, message, data }
      } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  // Manejar la selección de un usuario
  const handleUserSelect = (userId) => {
    const user = users.find((user) => user.id === userId);
    setSelectedUser(user);
    setNewPassword(""); // Resetea el campo de la nueva contraseña
    setErrors({}); // Limpia los errores anteriores
  };

  // Manejar el cambio de contraseña
  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/administracion/passwordReset/${selectedUser.id}`,
        {
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Contraseña actualizada exitosamente.");
        setNewPassword(""); // Resetea el campo de la nueva contraseña
        setSelectedUser(null); // Resetea el usuario seleccionado
        setErrors({}); // Limpia los errores
      } else {
        alert("Error al actualizar la contraseña.");
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Manejar errores de validación
        setErrors(error.response.data.errors);
      } else {
        console.error("Error al actualizar la contraseña:", error);
        alert("Ocurrió un error al actualizar la contraseña.");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Cambiar Contraseña</h2>
            <Breadcrumb></Breadcrumb>
          </div>
        </div>

        <Card className="w-full max-w-4xl mx-auto">
          <div className="flex h-[500px]">
            {/* Lista de usuarios (lado izquierdo) */}
            <div className="w-full border-r border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4">Usuarios disponibles</h2>
              <ScrollArea className="h-[420px]">
                <div className="space-y-2">
                  {users.map((user) => (
                    <Button
                      key={user.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleUserSelect(user.id)}
                    >
                      {user.persona} ({user.username})
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Formulario de cambio de contraseña (lado derecho) */}
            <div className="w-2/3 p-4">
              <h2 className="text-lg font-semibold mb-4">Cambiar Contraseña</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="selectedUser" className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario Seleccionado
                  </label>
                  <Input
                    id="selectedUser"
                    value={selectedUser ? selectedUser.username : ""}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ingrese la nueva contraseña"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password.join("\n")}</p>
                  )}
                </div>
                <Button
                  onClick={handlePasswordChange}
                  disabled={!selectedUser || !newPassword} // Solo habilitar si hay usuario y contraseña
                  className="w-full"
                >
                  Cambiar Contraseña
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}