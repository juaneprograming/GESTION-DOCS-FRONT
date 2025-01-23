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
      const response = await axios.post(
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
        telefono: "",
        cargo_id: "",
        sede_id: "",
        area_id: "",
      });
      toast.success("Empleado creado Exitosamente");
      onEmpleadoCreado && onEmpleadoCreado(); // Actualiza la lista en el padre
    } catch (error) {
      toast.error("Error al Crear Empleado:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || "Error al crear el empleado");
      }
    } finally {
      setLoading(false);
    }
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
          <div className="grid items-center gap-4">
            <Label htmlFor="nombre_1">Nombre 1 *</Label>
            <Input
              id="nombre_1"
              value={formData.nombre_1}
              onChange={(e) => handleChange("nombre_1", e.target.value)}
              className={errors.nombre_1 ? "border-red-500" : ""}
            />
            {errors.nombre_1 && <span className="text-red-500 text-sm">{errors.nombre_1}</span>}
          </div>
          {/* Nombre 2 */}
          <div className="grid items-center gap-4">
            <Label htmlFor="nombre_2">Nombre 2</Label>
            <Input
              id="nombre_2"
              value={formData.nombre_2}
              onChange={(e) => handleChange("nombre_2", e.target.value)}
            />
          </div>
          {/* Apellido 1 */}
          <div className="grid items-center gap-4">
            <Label htmlFor="apellido_1">Apellido 1</Label>
            <Input
              id="apellido_1"
              value={formData.apellido_1}
              onChange={(e) => handleChange("apellido_1", e.target.value)}
            />
          </div>
          {/* Apellido 2 */}
          <div className="grid items-center gap-4">
            <Label htmlFor="apellido_2">Apellido 2</Label>
            <Input
              id="apellido_2"
              value={formData.apellido_2}
              onChange={(e) => handleChange("apellido_2", e.target.value)}
            />
          </div>
          {/* Tipo de Identificación */}
          <div className="grid items-center gap-4">
            <Label htmlFor="tipo_identificacion">Tipo de Identificación</Label>
            <Select
              name="tipo_identificacion"
              value={formData.tipo_identificacion || ""} // Asegúrate de que no sea undefined o null
              onValueChange={(value) => handleChange("tipo_identificacion", value)}
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
          </div>
          {/* Número de Identificación */}
          <div className="grid items-center gap-4">
            <Label htmlFor="numero_identificacion">Número de Identificación</Label>
            <Input
              id="numero_identificacion"
              value={formData.numero_identificacion}
              onChange={(e) => handleChange("numero_identificacion", e.target.value)}
            />
          </div>
          {/* Correo Electrónico */}
          <div className="grid items-center gap-4">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <Input
              id="correo"
              type="email"
              value={formData.correo || ""} // Asegúrate de que no sea undefined o null
              onChange={(e) => handleChange("correo", e.target.value)}
            />
          </div>
          {/* Teléfono */}
          <div className="grid items-center gap-4">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono || ""} // Asegúrate de que no sea undefined o null
              onChange={(e) => handleChange("telefono", e.target.value)}
            />
          </div>

          {/* sede */}
          <div className="grid items-center gap-4">
            <Label htmlFor="sede_id">Sede *</Label>
            <Select
              value={formData.sede_id || ""} // Asegúrate de que no sea undefined o null
              onValueChange={(value) => handleChange("sede_id", value)}
            >
              <SelectTrigger className={errors.sede_id ? "border-red-500" : ""}>
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
            {errors.sede_id && <span className="text-red-500 text-sm">{errors.sede_id}</span>}
          </div>
          {/* Área */}
          <div className="grid items-center gap-4">
            <Label htmlFor="area_id">Área</Label>
            <Select name="area_id" onValueChange={(value) => handleChange("area_id", value)}>
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
            <Label htmlFor="cargo_id">Cargo</Label>
            <Select name="cargo_id" onValueChange={(value) => handleChange("cargo_id", value)}>
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
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
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