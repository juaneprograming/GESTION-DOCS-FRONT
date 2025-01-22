"use client";

import { useState, useEffect } from "react";
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
import axios from "axios";

export function CreateEmpleado() {
  const [open, setOpen] = useState(false);
  const [areas, setAreas] = useState([]);
  // const [sedes, setSedes] = useState([]);
  const [cargos, setCargos] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch areas
        const areasResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/areas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response (Areas):', areasResponse.data);
        setAreas(areasResponse.data.data || []);
        console.log('Updated areas State:', areasResponse.data.data);

        // Fetch cargos
        const cargosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/cargos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response (Cargos):', cargosResponse.data);
        setCargos(cargosResponse.data.data || []);
        console.log('Updated cargos State:', cargosResponse.data.data);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);


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
              name="nombre_1"
              value={formData.nombre1}
              onChange={(e) => handleChange("nombre1", e.target.value)}
            />
          </div>
          {/* Nombre 2 */}
          <div className="grid items-center gap-4">
            <Label htmlFor="nombre2">Nombre 2</Label>
            <Input
              id="nombre2"
              name="nombre_2"
              value={formData.nombre2}
              onChange={(e) => handleChange("nombre2", e.target.value)}
            />
          </div>
          {/* Apellido 1 */}
          <div className="grid items-center gap-4">
            <Label htmlFor="apellido1">Apellido 1</Label>
            <Input
              id="apellido1"
              name="apellido_1"
              value={formData.apellido1}
              onChange={(e) => handleChange("apellido1", e.target.value)}
            />
          </div>
          {/* Apellido 2 */}
          <div className="grid items-center gap-4">
            <Label htmlFor="apellido2">Apellido 2</Label>
            <Input
              id="apellido2"
              name="apellido_2"
              value={formData.apellido2}
              onChange={(e) => handleChange("apellido2", e.target.value)}
            />
          </div>
          {/* Tipo de Identificación */}
          <div className="grid items-center gap-4">
            <Label htmlFor="tipoIdentificacion">Tipo de Identificación</Label>
            <Select
              name="tipo_identificacion"
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
              name="numero_identificacion"
              value={formData.numeroIdentificacion}
              onChange={(e) => handleChange("numeroIdentificacion", e.target.value)}
            />
          </div>
          {/* Correo Electrónico */}
          <div className="grid items-center gap-4">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <Input
              id="correo"
              name="correo"
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
              name="telefono"
              value={formData.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
            />
          </div>
          {/* Sede */}
          <div className="grid items-center gap-4">
            <Label htmlFor="sede">Sede</Label>
            <Select name="sede_id" onValueChange={(value) => handleChange("sedes", value)}>
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
            <Select name="area_id" onValueChange={(value) => handleChange("area", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>{area.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Cargo */}
          <div className="grid items-center gap-4">
            <Label htmlFor="cargo">Cargo</Label>
            <Select name="cargo_id" onValueChange={(value) => handleChange("cargo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un cargo" />
              </SelectTrigger>
              <SelectContent>
                {cargos.map((cargo) => (
                  <SelectItem key={cargo.id} value={cargo.id}>
                    {cargo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              try {
                const response = await axios.post("/api/empleados", formData);
                console.log("Empleado creado:", response.data);
                alert("Empleado creado con éxito");
                setOpen(false); // Cierra el modal
              } catch (error) {
                console.error("Error al crear el empleado:", error.response?.data || error.message);
                alert("Ocurrió un error al guardar el empleado.");
              }
            }}
          >
            Guardar
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}
