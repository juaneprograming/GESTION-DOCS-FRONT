import { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AreaSearch() {
  const [areas, setAreas] = useState([]); // Todas las áreas
  const [selectedAreaId, setSelectedAreaId] = useState(null); // ID del área seleccionada
  const [foundArea, setFoundArea] = useState(null); // Área encontrada
  const [isEditing, setIsEditing] = useState(false); // Modo edición
  const [editedArea, setEditedArea] = useState(null); // Datos editados

  // Obtener todas las áreas al cargar el componente
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No se encontró el token de autenticación.");
          return;
        }
  
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/administracion/areas`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
  
        // Verificar si la respuesta contiene datos válidos
        if (response.data.success && Array.isArray(response.data.data)) {
          setAreas(response.data.data);
        } else {
          console.error("La respuesta del servidor no contiene datos válidos.");
        }
      } catch (error) {
        console.error("Error al obtener las áreas:", error.response?.data || error.message);
      }
    };
  
    fetchAreas();
  }, []);

  // Manejar la selección de un área
  const handleSelectArea = (value) => {
    const areaId = parseInt(value, 10);
    setSelectedAreaId(areaId);
    const selected = areas.find((area) => area.id === areaId);
    setFoundArea(selected || null);
    setEditedArea(selected || null);
    setIsEditing(false);
  };

  // Guardar los cambios
  const handleSave = async () => {
    if (editedArea) {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/administracion/areas/${editedArea.id}`,
          editedArea,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFoundArea(editedArea);
        setIsEditing(false);
        console.log("Cambios guardados exitosamente.");
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Selector de Áreas */}
      <div>
        <Label>Selecciona un Área</Label>
        <Select onValueChange={handleSelectArea}>
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
      </div>

      {/* Mostrar Información del Área */}
      {foundArea && (
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Nombre del Área</Label>
            {isEditing ? (
              <Input
                value={editedArea?.nombre}
                onChange={(e) =>
                  setEditedArea({ ...editedArea, nombre: e.target.value })
                }
              />
            ) : (
              <div className="p-2 border rounded-md bg-muted">
                {foundArea.nombre}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            {isEditing ? (
              <Input
                value={editedArea?.descripcion}
                onChange={(e) =>
                  setEditedArea({ ...editedArea, descripcion: e.target.value })
                }
              />
            ) : (
              <div className="p-2 border rounded-md bg-muted">
                {foundArea.descripcion}
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Guardar</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedArea(foundArea);
                  }}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Editar</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}