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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
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
      }
    };

    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo cuando el usuario modifica el valor
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/administracion/empleados`,
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
        onEmpleadoCreado && onEmpleadoCreado(); // Actualiza la lista en el padre
    } catch (error) {
        if (error.response?.data?.errors) {
            const validationErrors = error.response.data.errors;
            setErrors(validationErrors);

            // Mostrar mensaje para correo duplicado
            if (validationErrors.correo) {
                toast.error("Este correo ya está registrado.");
            }

            // Mostrar otros errores de validación
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
    const requiredFields = ["nombre_1", "apellido_1", "tipo_identificacion", "numero_identificacion", "correo", "sede_id", "area_id", "cargo_id"];
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
      {/* Nombre 1 */}
      <div className="grid items-center gap-1 relative">
        <Label htmlFor="nombre_1" className="mb-1">Nombre 1 *</Label>
        <Input
          id="nombre_1"
          value={formData.nombre_1}
          onChange={(e) => handleChange("nombre_1", e.target.value)}
          className={errors.nombre_1 ? "border-red-500" : ""}
        />
        {errors.nombre_1 && <span className="text-red-500 text-sm absolute -bottom-5">{errors.nombre_1}</span>}
      </div>

      {/* Nombre 2 */}
      <div className="grid items-center gap-1">
        <Label htmlFor="nombre_2">Nombre 2</Label>
        <Input
          id="nombre_2"
          value={formData.nombre_2}
          onChange={(e) => handleChange("nombre_2", e.target.value)}
        />
      </div>

      {/* Apellido 1 */}
      <div className="grid items-center gap-1 relative">
        <Label htmlFor="apellido_1" className="mb-1">Apellido 1 *</Label>
        <Input
          id="apellido_1"
          value={formData.apellido_1}
          onChange={(e) => handleChange("apellido_1", e.target.value)}
          className={errors.apellido_1 ? "border-red-500" : ""}
        />
        {errors.apellido_1 && <span className="text-red-500 text-sm absolute -bottom-5">{errors.apellido_1}</span>}
      </div>

      {/* Apellido 2 */}
      <div className="grid items-center gap-1">
        <Label htmlFor="apellido_2">Apellido 2</Label>
        <Input
          id="apellido_2"
          value={formData.apellido_2}
          onChange={(e) => handleChange("apellido_2", e.target.value)}
        />
      </div>

      {/* Tipo de Identificación */}
      <div className="grid items-center gap-1 relative">
        <Label className="mb-1">Tipo de Identificación *</Label>
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

      {/* Número de Identificación */}
      <div className="grid items-center gap-1 relative">
        <Label htmlFor="numero_identificacion" className="mb-1">Número de Identificación *</Label>
        <Input
          id="numero_identificacion"
          value={formData.numero_identificacion}
          onChange={(e) => handleChange("numero_identificacion", e.target.value)}
          className={errors.numero_identificacion ? "border-red-500" : ""}
        />
        {errors.numero_identificacion && <span className="text-red-500 text-sm absolute -bottom-5">{errors.numero_identificacion}</span>}
      </div>

      {/* Correo Electrónico */}
      <div className="grid items-center gap-1 relative">
        <Label htmlFor="correo" className="mb-1">Correo Electrónico *</Label>
        <Input
          id="correo"
          type="email"
          value={formData.correo || ""}
          onChange={(e) => handleChange("correo", e.target.value)}
          className={errors.correo ? "border-red-500" : ""}
        />
        {errors.correo && <span className="text-red-500 text-sm absolute -bottom-5">{errors.correo}</span>}
      </div>

      {/* Teléfono */}
      <div className="grid items-center gap-1">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          value={formData.telefono || ""}
          onChange={(e) => handleChange("telefono", e.target.value)}
        />
      </div>

      {/* Sede */}
      <div className="grid items-center gap-1 relative">
        <Label className="mb-1">Sede *</Label>
        <Select
          value={formData.sede_id || ""}
          onValueChange={(value) => handleChange("sede_id", value)}
          className={errors.sede_id ? "border-red-500" : ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una sede" />
          </SelectTrigger>
          <SelectContent>
            {sedes.map((sede) => (
              <SelectItem key={sede.id} value={sede.id.toString()}>
                {sede.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.sede_id && <span className="text-red-500 text-sm absolute -bottom-5">{errors.sede_id}</span>}
      </div>

      {/* Área */}
      <div className="grid items-center gap-1 relative">
        <Label className="mb-1">Área *</Label>
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

      {/* Cargo */}
      <div className="grid items-center gap-1 relative">
        <Label className="mb-1">Cargo *</Label>
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