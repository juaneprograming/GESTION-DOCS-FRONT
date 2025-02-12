'use client';

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

export function EditEntidad({ entidadId, onEntidadActualizada }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    nombre: "",
    nit: "",
    direccion: "",
    mision: "",
    vision: ""
  });

  const [originalData, setOriginalData] = useState({
    nombre: "",
    nit: "",
    direccion: "",
    mision: "",
    vision: ""
  });

  const fetchEntidadData = useCallback(async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/administracion/entidades/${entidadId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const entidadData = response.data.data || response.data.entidad || response.data;
      
      // Crear objeto con datos iniciales
      const initialData = {
        nombre: entidadData.nombre || "",
        nit: entidadData.nit || "",
        direccion: entidadData.direccion || "",
        mision: entidadData.mision || "",
        vision: entidadData.vision || "",
      };
  
      // Actualizar ambos estados
      setOriginalData(initialData);
      setFormData(initialData);
  
    } catch (err) {
      toast.error("Error cargando datos de la entidad");
      console.error("Fetch error:", err);
    } finally {
      setIsFetching(false);
    }
  }, [entidadId]);

  useEffect(() => {
    if (open && entidadId) {
      fetchEntidadData();
    }
  }, [open, entidadId, fetchEntidadData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined, general: undefined }));
  };


  const handleSubmit = async () => {
    // Verificar si hay cambios
    if (JSON.stringify(formData) === JSON.stringify(originalData)) {
      toast.info("Ningún campo ha sido modificado");
      return; // Cancelar el envío
    }
  
    setLoading(true);
    setErrors({});
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      // Preparar payload solo con campos modificados
      const payload = {
        nombre: formData.nombre,
        nit: formData.nit,
        direccion: formData.direccion,
        mision: formData.mision,
        vision: formData.vision
      };
  
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/administracion/entidades/${entidadId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      // Actualizar datos originales con la respuesta del servidor
      const updatedData = response.data.data || response.data;
      setOriginalData({
        nombre: updatedData.nombre,
        nit: updatedData.nit,
        direccion: updatedData.direccion,
        mision: updatedData.mision,
        vision: updatedData.vision
      });
  
      toast.success("Entidad actualizada exitosamente");
      if (onEntidadActualizada) onEntidadActualizada();
      setOpen(false);
  
    } catch (error) {
      console.error("Error al actualizar:", error);
  
      // Manejo de errores
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(prev => ({
          ...prev,
          general: error.response?.data?.message || "Error al actualizar la entidad"
        }));
      }
      
      const errorMessage = error.response?.data?.message || "Error inesperado al actualizar";
      toast.error(`Error al Actualizar: ${errorMessage}`);
  
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, type) => {
    if (type === 'letter' && !/[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
    }
};


  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setErrors({});
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Editar Entidad</DialogTitle>
          <DialogDescription>
            Modifica los campos necesarios para actualizar la información de la entidad.
          </DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="text-center">Cargando datos...</div>
        ) : (
          <div className="grid gap-4 py-4 grid-cols-2">
            {/* Campos del formulario */}
            <div className="space-y-4">
              <div className="grid items-center gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  disabled={loading}
                  onKeyPress={(e) => handleKeyPress(e, 'letter')}
                />
                {errors.nombre && (
                  <span className="text-red-500 text-sm">{errors.nombre[0]}</span>
                )}
              </div>

              <div className="grid items-center gap-2">
                <Label htmlFor="nit">NIT</Label>
                <Input
                  id="nit"
                  value={formData.nit}
                  onChange={(e) => handleChange("nit", e.target.value)}
                  disabled={true} // Deshabilitado
                />
                {errors.nit && (
                  <span className="text-red-500 text-sm">{errors.nit[0]}</span>
                )}
              </div>

              <div className="grid items-center gap-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  disabled={loading}
                />
                {errors.direccion && (
                  <span className="text-red-500 text-sm">{errors.direccion[0]}</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid items-center gap-2">
                <Label htmlFor="mision">Misión</Label>
                <Input
                  id="mision"
                  value={formData.mision}
                  onChange={(e) => handleChange("mision", e.target.value)}
                  disabled={loading}
                  onKeyPress={(e) => handleKeyPress(e, 'letter')}
                />
                {errors.mision && (
                  <span className="text-red-500 text-sm">{errors.mision[0]}</span>
                )}
              </div>

              <div className="grid items-center gap-2">
                <Label htmlFor="vision">Visión</Label>
                <Input
                  id="vision"
                  value={formData.vision}
                  onChange={(e) => handleChange("vision", e.target.value)}
                  disabled={loading}
                  onKeyPress={(e) => handleKeyPress(e, 'letter')}
                />
                {errors.vision && (
                  <span className="text-red-500 text-sm">{errors.vision[0]}</span>
                )}
              </div>
            </div>

            {errors.general && (
              <div className="col-span-2 text-center text-red-500 text-sm">
                {errors.general}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || isFetching}
          >
            {loading ? "Guardando..." : "Actualizar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}