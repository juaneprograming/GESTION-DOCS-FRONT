import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { Edit } from "lucide-react"
import { toast } from "sonner"

export function GestorForm({}) {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [gestorData, setGestorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchGestorData = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        // Mantenemos los campos separados como vienen de la API
        const data = {
          tipo_identificacion_gestor: response.data.tipo_identificacion_gestor,
          identificacion_gestor: response.data.identificacion_gestor,
          primer_nombre_gestor: response.data.primer_nombre_gestor,
          segundo_nombre_gestor: response.data.segundo_nombre_gestor,
          primer_apellido_gestor: response.data.primer_apellido_gestor,
          segundo_apellido_gestor: response.data.segundo_apellido_gestor,
        };

        setGestorData(data);
        setOriginalData({ ...data }); // Guardar una copia inicial de los datos
      } catch (err) {
        console.error("Error fetching Gestor data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchGestorData()
    else setLoading(false)
  }, [id])

  const handleEditClick = () => {
    setIsEditing(true) // Habilitar el modo edición
  }

  const handleSave = async () => {
    try {
      // Verificar que los datos originales y actuales estén disponibles
      if (!originalData || !gestorData) {
        console.error("Datos originales o actuales no están disponibles");
        toast.error("Ocurrió un error al comparar los datos.");
        return;
      }

      // Comparar los datos originales con los datos actuales
      const hasChanges = Object.keys(originalData).some(
        (key) => originalData[key] !== gestorData[key]
      );

      if (!hasChanges) {
        // Si no hay cambios, mostrar un mensaje informativo
        toast.info("No se ha modificado ningún campo.");
        setIsEditing(false); // Desactivar el modo edición
        return;
      }

      const token = localStorage.getItem("token");

      // Enviar los datos actualizados al backend
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${id}`,
        {
          form_type: "gestor",
          ...gestorData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditing(false); // Desactivar el modo edición después de guardar
      setOriginalData({ ...gestorData }); // Actualizar los datos originales
      toast.success("Cambios guardados exitosamente");
    } catch (err) {
      let errorMessage = "Ocurrió un error desconocido";
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        errorMessage = err.response.data?.error || "Error en el servidor";
      } else if (err.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorMessage = "No se recibió respuesta del servidor";
      } else {
        // Otro tipo de error
        errorMessage = err.message;
      }
      console.error("Error updating gestor data:", errorMessage);
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="p-4">Cargando datos del gestor...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <Card>
      <CardContent className="p-6">
        {/* Contenedor para el botón */}
        <div className="flex justify-end mb-4">
          {isEditing ? (
            <Button variant="outline" onClick={handleSave}>
              Guardar Cambios
            </Button>
          ) : (
            <Button variant="outline" onClick={handleEditClick}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Información
            </Button>
          )}
        </div>
        <div className="space-y-6">
          {/* Grupo de Identificación */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_identificacion_gestor">Tipo de Identificación</Label>
              <Input 
                id="tipo_identificacion_gestor" 
                readOnly={!isEditing}
                value={gestorData?.tipo_identificacion_gestor || ''}
                onChange={(e) => setGestorData({...gestorData, tipo_identificacion_gestor: e.target.value})}
                className="font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identificacion_gestor">Número de Identificación</Label>
              <Input 
                id="identificacion_gestor" 
                readOnly={!isEditing}
                value={gestorData?.identificacion_gestor || ''}
                onChange={(e) => setGestorData({...gestorData, identificacion_gestor: e.target.value})}
              />
            </div>
          </div>

          {/* Grupo de Nombres */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primer_nombre_gestor">Primer Nombre</Label>
              <Input 
                id="primer_nombre_gestor" 
                readOnly={!isEditing}
                value={gestorData?.primer_nombre_gestor || ''}
                onChange={(e) => setGestorData({...gestorData, primer_nombre_gestor: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segundo_nombre_gestor">Segundo Nombre</Label>
              <Input 
                id="segundo_nombre_gestor" 
                readOnly={!isEditing}
                value={gestorData?.segundo_nombre_gestor || ''}
                onChange={(e) => setGestorData({...gestorData, segundo_nombre_gestor: e.target.value})}
              />
            </div>
          </div>

          {/* Grupo de Apellidos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primer_apellido_gestor">Primer Apellido</Label>
              <Input 
                id="primer_apellido_gestor" 
                readOnly={!isEditing}
                value={gestorData?.primer_apellido_gestor || ''}
                onChange={(e) => setGestorData({...gestorData, primer_apellido_gestor: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segundo_apellido_gestor">Segundo Apellido</Label>
              <Input 
                id="segundo_apellido_gestor" 
                readOnly={!isEditing}
                value={gestorData?.segundo_apellido_gestor || ''}
                onChange={(e) => setGestorData({...gestorData, segundo_apellido_gestor: e.target.value})}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GestorForm