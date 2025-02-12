"use client"; // Asegura que este componente se ejecute en el cliente

import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";

export function CreateEmpleado({ onEmpleadoCreado }) {
  const [open, setOpen] = useState(false);
  const [areas, setAreas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [cargos, setCargos] = useState([]);
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
    area_id: "",
  });

  // Cargar datos iniciales (áreas, sedes, cargos)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const [areasRes, cargosRes, sedesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/areas`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/cargos`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/sedes`, config),
        ]);
        setAreas(areasRes.data.data || []);
        setCargos(cargosRes.data.data || []);
        setSedes(sedesRes.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Error al cargar los datos necesarios. Por favor, intenta nuevamente.");
      }
    };
    fetchData();
  }, []);

  // Manejar cambios en los campos de texto
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

  // Validar campos de texto (solo letras)
  const handleTextChange = (field, value) => {
    if (/^[a-zA-Z\s]*$/.test(value)) {
      handleChange(field, value);
    }
  };

  // Validar campos numéricos
  const handleNumberChange = (field, value) => {
    if (/^\d*$/.test(value)) {
      handleChange(field, value);
    }
  };

  // Validar formulario antes de enviar
  const validateForm = () => {
    const requiredFields = [
      "nombre_1",
      "apellido_1",
      "tipo_identificacion",
      "numero_identificacion",
      "correo",
      "sede_id",
      "area_id",
      "cargo_id",
    ];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Este campo es requerido";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      setOpen(false);
      setFormData({
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
        area_id: "",
      });
      toast.success("Empleado creado exitosamente");
      onEmpleadoCreado && onEmpleadoCreado();
    } catch (error) {
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        setErrors(validationErrors);
        if (validationErrors.correo) {
          toast.error("Este correo ya está registrado.");
        }
        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (field !== "correo") {
            toast.error(messages[0]);
          }
        });
      } else {
        toast.error(
          `Error al crear el empleado: ${
            error.response?.data?.message || "Error desconocido"
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Empleado
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Empleado</DialogTitle>
          <DialogDescription>
            Por favor, completa los campos necesarios para registrar un nuevo empleado.
          </DialogDescription>
        </DialogHeader>

        {/* Campos del formulario */}
        <div>
          <Label>Nombre 1 *</Label>
          <Input
            value={formData.nombre_1}
            onChange={(e) => handleTextChange("nombre_1", e.target.value)}
            className={errors.nombre_1 ? "border-red-500" : ""}
          />
          {errors.nombre_1 && <p className="text-red-500">{errors.nombre_1}</p>}
        </div>

        <div>
          <Label>Apellido 1 *</Label>
          <Input
            value={formData.apellido_1}
            onChange={(e) => handleTextChange("apellido_1", e.target.value)}
            className={errors.apellido_1 ? "border-red-500" : ""}
          />
          {errors.apellido_1 && <p className="text-red-500">{errors.apellido_1}</p>}
        </div>

        <div>
          <Label>Tipo de Identificación *</Label>
          <Select
            value={formData.tipo_identificacion}
            onValueChange={(value) => handleChange("tipo_identificacion", value)}
            className={errors.tipo_identificacion ? "border-red-500" : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
              <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
              <SelectItem value="TE">Tarjeta de Extranjería</SelectItem>
            </SelectContent>
          </Select>
          {errors.tipo_identificacion && (
            <p className="text-red-500">{errors.tipo_identificacion}</p>
          )}
        </div>

        <div>
          <Label>Número de Identificación *</Label>
          <Input
            value={formData.numero_identificacion}
            onChange={(e) => handleNumberChange("numero_identificacion", e.target.value)}
            className={errors.numero_identificacion ? "border-red-500" : ""}
          />
          {errors.numero_identificacion && (
            <p className="text-red-500">{errors.numero_identificacion}</p>
          )}
        </div>

        <div>
          <Label>Correo Electrónico *</Label>
          <Input
            value={formData.correo}
            onChange={(e) => handleChange("correo", e.target.value)}
            className={errors.correo ? "border-red-500" : ""}
          />
          {errors.correo && <p className="text-red-500">{errors.correo}</p>}
        </div>

        <div>
          <Label>Sede *</Label>
          <Select
            value={formData.sede_id}
            onValueChange={(value) => handleChange("sede_id", value)}
            className={errors.sede_id ? "border-red-500" : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una sede" />
            </SelectTrigger>
            <SelectContent>
              {sedes.map((sede) => (
                <SelectItem key={sede.id} value={sede.id.toString()}>
                  {sede.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.sede_id && <p className="text-red-500">{errors.sede_id}</p>}
        </div>

        <div>
          <Label>Área *</Label>
          <Select
            value={formData.area_id}
            onValueChange={(value) => handleChange("area_id", value)}
            className={errors.area_id ? "border-red-500" : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un área" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id.toString()}>
                  {area.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.area_id && <p className="text-red-500">{errors.area_id}</p>}
        </div>

        <div>
          <Label>Cargo *</Label>
          <Select
            value={formData.cargo_id}
            onValueChange={(value) => handleChange("cargo_id", value)}
            className={errors.cargo_id ? "border-red-500" : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un cargo" />
            </SelectTrigger>
            <SelectContent>
              {cargos.map((cargo) => (
                <SelectItem key={cargo.id} value={cargo.id.toString()}>
                  {cargo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cargo_id && <p className="text-red-500">{errors.cargo_id}</p>}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
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