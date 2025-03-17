"use client"
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
import { toast } from 'sonner';
import Image from "next/image"

export function CreateEmpleado({ onEmpleadoCreado }) {
  const [open, setOpen] = useState(false);
  const [areas, setAreas] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null)

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
    area_id: "",
    foto: null,
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

        const [areasRes, cargosRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/areas`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/cargos`, config),

        ]);

        setAreas(areasRes.data.data || []);
        setCargos(cargosRes.data.data || []);

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const handleTextChange = (field, value) => {
    if (/^[a-zA-Z\s]*$/.test(value)) {
      handleChange(field, value);
    }
  };

  const handleNumberChange = (field, value) => {
    if (/^\d*$/.test(value)) {
      handleChange(field, value);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, foto: file }))
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!validateForm()) {
        toast.error("Por favor, complete todos los campos requeridos.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Añade todos los campos de texto a FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'foto') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Añade la foto si existe
      if (formData.foto) {
        formDataToSend.append('foto', formData.foto);
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
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
        area_id: "",
        foto: null,
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
          if (field !== 'correo') {
            toast.error(messages[0]);
          }
        });
      } else {
        toast.error(`Error al crear el empleado: ${error.response?.data?.message || 'Error en la creación del empleado'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const requiredFields = ["nombre_1", "apellido_1", "tipo_identificacion", "numero_identificacion", "correo", "area_id", "cargo_id"];
    const newErrors = {};

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "Este campo es requerido";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button className="gap-2 bg-black hover:bg-gray-800 text-white">
        <Plus className="h-4 w-4" />
        Nuevo Empleado
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>Crear Empleado</DialogTitle>
        <DialogDescription>
          Por favor, completa los campos necesarios para registrar un nuevo empleado.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4 grid-cols-2">
        <div className="grid items-center gap-1 relative">
          <Label htmlFor="nombre_1" className="mb-1 flex items-center">
            Nombre 1 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="nombre_1"
            value={formData.nombre_1}
            onChange={(e) => handleTextChange("nombre_1", e.target.value)}
            className={errors.nombre_1 ? "border-red-500" : ""}
          />
          {errors.nombre_1 && <span className="text-red-500 text-sm absolute -bottom-5">{errors.nombre_1}</span>}
        </div>

        <div className="grid items-center gap-1">
          <Label htmlFor="nombre_2">Nombre 2</Label>
          <Input
            id="nombre_2"
            value={formData.nombre_2}
            onChange={(e) => handleTextChange("nombre_2", e.target.value)}
          />
        </div>

        <div className="grid items-center gap-1 relative">
          <Label htmlFor="apellido_1" className="mb-1 flex items-center">
            Apellido 1 <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="apellido_1"
            value={formData.apellido_1}
            onChange={(e) => handleTextChange("apellido_1", e.target.value)}
            className={errors.apellido_1 ? "border-red-500" : ""}
          />
          {errors.apellido_1 && <span className="text-red-500 text-sm absolute -bottom-5">{errors.apellido_1}</span>}
        </div>

        <div className="grid items-center gap-1">
          <Label htmlFor="apellido_2">Apellido 2</Label>
          <Input
            id="apellido_2"
            value={formData.apellido_2}
            onChange={(e) => handleTextChange("apellido_2", e.target.value)}
          />
        </div>

        <div className="grid items-center gap-1 relative">
          <Label className="mb-1 flex items-center">
            Tipo de Identificación <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData.tipo_identificacion || ""}
            onValueChange={(value) => handleChange("tipo_identificacion", value)}
            className={errors.tipo_identificacion ? "border-red-500" : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
              <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
              <SelectItem value="CE">Tarjeta de Extranjería</SelectItem>
            </SelectContent>
          </Select>
          {errors.tipo_identificacion && <span className="text-red-500 text-sm absolute -bottom-5">{errors.tipo_identificacion}</span>}
        </div>

        <div className="grid items-center gap-1 relative">
          <Label htmlFor="numero_identificacion" className="mb-1 flex items-center">
            Número de Identificación <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="numero_identificacion"
            value={formData.numero_identificacion}
            onChange={(e) => handleNumberChange("numero_identificacion", e.target.value)}
            className={errors.numero_identificacion ? "border-red-500" : ""}
          />
          {errors.numero_identificacion && <span className="text-red-500 text-sm absolute -bottom-5">{errors.numero_identificacion}</span>}
        </div>

        <div className="grid items-center gap-1 relative">
          <Label htmlFor="correo" className="mb-1 flex items-center">
            Correo Electrónico <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="correo"
            type="email"
            value={formData.correo || ""}
            onChange={(e) => handleChange("correo", e.target.value)}
            className={errors.correo ? "border-red-500" : ""}
          />
          {errors.correo && <span className="text-red-500 text-sm absolute -bottom-5">{errors.correo}</span>}
        </div>

        <div className="grid items-center gap-1">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={formData.telefono || ""}
            onChange={(e) => handleNumberChange("telefono", e.target.value)}
          />
        </div>

        <div className="grid items-center gap-1 relative">
          <Label className="mb-1 flex items-center">
            Área <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            onValueChange={(value) => handleChange("area_id", value)}
            className={errors.area_id ? "border-red-500" : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un área" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id}>{area.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.area_id && <span className="text-red-500 text-sm absolute -bottom-5">{errors.area_id}</span>}
        </div>

        <div className="grid items-center gap-1 relative">
          <Label className="mb-1 flex items-center">
            Cargo <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            onValueChange={(value) => handleChange("cargo_id", value)}
            className={errors.cargo_id ? "border-red-500" : ""}
          >
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
          {errors.cargo_id && <span className="text-red-500 text-sm absolute -bottom-5">{errors.cargo_id}</span>}
        </div>
      </div>
              <div className="flex items-center gap-12">
                <div className="w-[300px]">
                  <Label htmlFor="foto" className="text-sm">
                    Foto
                  </Label>
                  <Input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="cursor-pointer h-8"
                  />
                </div>
                {photoPreview && (
              <div className="mt-2">
                <Image
                  src={photoPreview}
                  alt="Foto de perfil"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover" 
                />
              </div>
            )}
              </div>
              
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={() => {
          if (validateForm()) {
            handleSubmit();
          } else {
            toast.error("Por favor, complete todos los campos requeridos.");
          }
        }} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
  );
}
