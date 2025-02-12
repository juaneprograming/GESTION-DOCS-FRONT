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
import { toast } from 'sonner';

export function EditUsuario({ userId , onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [originalData, setOriginalData] = useState({}); // Nuevo estado para datos originales

  const [formData, setFormData] = useState({
    username: "",
    persona: "",
    email: "",
    password: "",
    fecha_expiracion: "",
    is_admin: "",
    estado: "",
  });

  const fetchUserData = useCallback(async () => {
    setIsFetchingUser(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token no encontrado. Inicia sesión nuevamente.");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/administracion/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userData = response.data.data || response.data;
      const initialData = {
        username: userData.username || "",
        persona: userData.persona || "",
        email: userData.email || "",
        password: "",
        fecha_expiracion: userData.fecha_expiracion || "",
        is_admin: userData.is_admin ? "true" : "false",
        estado: userData.estado ? "true" : "false",
      };
      
      setFormData(initialData);
      setOriginalData(initialData); // Almacenar datos originales

    } catch (err) {
      console.error("Error fetching user data:", err);
      setErrors((prev) => ({
        ...prev,
        general: "Error al cargar los datos del usuario.",
      }));
    } finally {
      setIsFetchingUser(false);
    }
  }, [userId]);

  useEffect(() => {
    if (open) {
      fetchUserData();
    }
  }, [open, fetchUserData]);

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
    setErrors({});

    // Comparar campos relevantes (excluyendo password)
    const relevantFields = ['username', 'email', 'is_admin', 'estado', 'fecha_expiracion'];
    const hasChanges = relevantFields.some(
      field => formData[field] !== originalData[field]
    );

    if (!hasChanges) {
      toast.info("No se han realizado cambios. Modifica algún campo para actualizar el usuario.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token no encontrado. Por favor, inicia sesión.");
      }

      const payload = {
        username: formData.username,
        email: formData.email,
        is_admin: formData.is_admin === "true",
        estado: formData.estado === "true",
        fecha_expiracion: formData.fecha_expiracion || null,
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/administracion/users/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Usuario actualizado exitosamente");
      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);

      if (error.response?.data?.errors) {
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
        setErrors((prev) => ({
          ...prev,
          general: error.response?.data?.message ||
            "Ocurrió un error inesperado al actualizar el usuario.",
        }));
        toast.error("Error al actualizar el usuario.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrefetch = useCallback(() => {
    if (!isFetchingUser) {
      fetchUserData();
    }
  }, [isFetchingUser, fetchUserData]);

  const handleKeyPress = (e, type) => {
    if (type === 'letter' && !/[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
    }
};

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
            usuario.
          </DialogDescription>
        </DialogHeader>

        {isFetchingUser ? (
          <p className="text-center">Cargando datos...</p>
        ) : (
          <div className="grid gap-4 py-4 grid-cols-2">
            {/* Campos del formulario (igual que antes) */}
            <div className="grid items-center gap-4">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className={errors.username ? "border-red-500" : ""}
                onKeyPress={(e) => handleKeyPress(e, 'letter')}
              />
              {errors.username && (
                <span className="text-red-500 text-sm">{errors.username}</span>
              )}
            </div>

            <div className="grid items-center gap-4">
              <Label htmlFor="persona">Persona</Label>
              <Input id="persona" value={formData.persona} readOnly />
            </div>

            <div className="grid items-center gap-4">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            <div className="grid items-center gap-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>

            <div className="grid items-center gap-4">
              <Label htmlFor="fecha_expiracion">Fecha Expiración</Label>
              <Input
                id="fecha_expiracion"
                type="date"
                value={formData.fecha_expiracion}
                onChange={(e) =>
                  handleChange("fecha_expiracion", e.target.value)
                }
              />
            </div>

            <div className="grid items-center gap-4">
              <Label htmlFor="is_admin">¿Es Admin?</Label>
              <Select
                value={formData.is_admin}
                onValueChange={(value) => handleChange("is_admin", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid items-center gap-4">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleChange("estado", value)}
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
          <p className="text-red-500 text-center">{errors.general}</p>
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