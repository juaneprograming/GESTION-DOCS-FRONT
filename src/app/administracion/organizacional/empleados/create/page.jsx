"use client";

import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CreateEmpleado() {
  const [open, setOpen] = useState(false);

  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    nombre1: "",
    nombre2: "",
    apellido1: "",
    apellido2: "",
    tipoIdentificacion: "",
    numeroIdentificacion: "",
    correo: "",
    telefono: "",
    sede: "",
    area: "",
    cargo: "",
  });

  // Función para manejar los cambios en los inputs
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-400">Crear Empleado</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Crear Empleado</DialogTitle>
          <DialogDescription>
            Por favor, completa los campos necesarios para registrar un nuevo empleado.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 grid-cols-2">
          {/* Nombre 1 */}
          <div className="grid items-center gap-4">
            <Label htmlFor="nombre1">Nombre 1</Label>
            <Input
              id="nombre1"
              value={formData.nombre1}
              onChange={(e) => handleChange("nombre1", e.target.value)}
            />
          </div>
          {/* Nombre 2 */}
          <div className="grid items-center gap-4">
            <Label htmlFor="nombre2">Nombre 2</Label>
            <Input
              id="nombre2"
              value={formData.nombre2}
              onChange={(e) => handleChange("nombre2", e.target.value)}
            />
          </div>
          {/* Apellido 1 */}
          <div className="grid items-center gap-4">
            <Label htmlFor="apellido1">Apellido 1</Label>
            <Input
              id="apellido1"
              value={formData.apellido1}
              onChange={(e) => handleChange("apellido1", e.target.value)}
            />
          </div>
          {/* Apellido 2 */}
          <div className="grid items-center gap-4">
            <Label htmlFor="apellido2">Apellido 2</Label>
            <Input
              id="apellido2"
              value={formData.apellido2}
              onChange={(e) => handleChange("apellido2", e.target.value)}
            />
          </div>
          {/* Tipo de Identificación */}
          <div className="grid items-center gap-4">
            <Label htmlFor="tipoIdentificacion">Tipo de Identificación</Label>
            <Select
              onValueChange={(value) => handleChange("tipoIdentificacion", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Número de Identificación */}
          <div className="grid items-center gap-4">
            <Label htmlFor="numeroIdentificacion">Número de Identificación</Label>
            <Input
              id="numeroIdentificacion"
              value={formData.numeroIdentificacion}
              onChange={(e) => handleChange("numeroIdentificacion", e.target.value)}
            />
          </div>
          {/* Correo Electrónico */}
          <div className="grid items-center gap-4">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <Input
              id="correo"
              type="email"
              value={formData.correo}
              onChange={(e) => handleChange("correo", e.target.value)}
            />
          </div>
          {/* Teléfono */}
          <div className="grid items-center gap-4">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
            />
          </div>
          {/* Sede */}
          <div className="grid items-center gap-4">
            <Label htmlFor="sede">Sede</Label>
            <Select onValueChange={(value) => handleChange("sede", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una sede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sede1">Sede 1</SelectItem>
                <SelectItem value="sede2">Sede 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Área */}
          <div className="grid items-center gap-4">
            <Label htmlFor="area">Área</Label>
            <Select onValueChange={(value) => handleChange("area", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area1">Área 1</SelectItem>
                <SelectItem value="area2">Área 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Cargo */}
          <div className="grid items-center gap-4">
            <Label htmlFor="cargo">Cargo</Label>
            <Select onValueChange={(value) => handleChange("cargo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cargo1">Cargo 1</SelectItem>
                <SelectItem value="cargo2">Cargo 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              console.log("Datos enviados:", formData);
              setOpen(false);
            }}
          >
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
