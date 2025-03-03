import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { Edit } from "lucide-react"
import { toast } from "sonner"

export function SolicitanteForm({}) {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [solicitanteData, setSolicitanteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchSolicitanteData = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Mantenemos los campos separados como vienen de la API
        const data = {
          tipo_identificacion_solicitante: response.data.tipo_identificacion_solicitante,
          identificacion_solicitante: response.data.identificacion_solicitante,
          primer_nombre_solicitante: response.data.primer_nombre_solicitante,
          segundo_nombre_solicitante: response.data.segundo_nombre_solicitante,
          primer_apellido_solicitante: response.data.primer_apellido_solicitante,
          segundo_apellido_solicitante: response.data.segundo_apellido_solicitante,
          direccion: response.data.direccion,
          departamento: response.data.departamento,
          municipio: response.data.municipio,
          telefono: response.data.telefono,
          celular: response.data.celular,
          email: response.data.email,
        };

        setSolicitanteData(data);
        setOriginalData({ ...data }); // Guardar una copia inicial de los datos
      } catch (err) {
        console.error("Error fetching Solicitante data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchSolicitanteData()
    else setLoading(false)
  }, [id])

  const handleEditClick = () => {
    setIsEditing(true) // Habilitar el modo edición
  }

  const handleSave = async () => {
    try {
      // Verificar que los datos originales y actuales estén disponibles
      if (!originalData || !solicitanteData) {
        console.error("Datos originales o actuales no están disponibles");
        toast.error("Ocurrió un error al comparar los datos.");
        return;
      }

      // Comparar los datos originales con los datos actuales
      const hasChanges = Object.keys(originalData).some(
        (key) => originalData[key] !== solicitanteData[key]
      );

      if (!hasChanges) {
        // Si no hay cambios, mostrar un mensaje informativo
        toast.info("No se ha modificado ningún campo.");
        setIsEditing(false); // Desactivar el modo edición
        return;
      }

      const token = localStorage.getItem("token");

      // Transforma los datos para que coincidan con el backend
      const transformedData = {
        form_type: "solicitantes",
        tipo_identificacion_gestor: solicitanteData.tipo_identificacion_solicitante,
        identificacion_gestor: solicitanteData.identificacion_solicitante,
        primer_nombre_gestor: solicitanteData.primer_nombre_solicitante,
        segundo_nombre_gestor: solicitanteData.segundo_nombre_solicitante,
        primer_apellido_gestor: solicitanteData.primer_apellido_solicitante,
        segundo_apellido_gestor: solicitanteData.segundo_apellido_solicitante,
        direccion: solicitanteData.direccion,
        departamento: solicitanteData.departamento,
        municipio: solicitanteData.municipio,
        telefono: solicitanteData.telefono,
        celular: solicitanteData.celular,
        email: solicitanteData.email,
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${id}`,
        transformedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditing(false); // Desactivar el modo edición después de guardar
      setOriginalData({ ...solicitanteData }); // Actualizar los datos originales
      toast.success("Datos del solicitante actualizados exitosamente");
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
      console.error("Error updating Solicitante data:", errorMessage);
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="p-4">Cargando datos del solicitante...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <Card>
      <CardContent className="p-6">
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
              <Label htmlFor="tipo_identificacion_solicitante">Tipo de Identificación</Label>
              <Input
                id="tipo_identificacion_solicitante"
                readOnly
                value={solicitanteData?.tipo_identificacion_solicitante || ''}
                onChange={(e) => setSolicitanteData({ ...solicitanteData, tipo_identificacion_solicitante: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identificacion_solicitante">Número de Identificación</Label>
              <Input
                id="identificacion_solicitante"
                readOnly
                value={solicitanteData?.identificacion_solicitante || ''}
                onChange={(e) => setSolicitanteData({ ...solicitanteData, identificacion_solicitante: e.target.value })}
              />
            </div>
          </div>

          {/* Grupo de Nombres */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primer_nombre_solicitante">Primer Nombre</Label>
              <Input
                id="primer_nombre_solicitante"
                readOnly
                value={solicitanteData?.primer_nombre_solicitante || ''}
                onChange={(e) => setSolicitanteData({ ...solicitanteData, primer_nombre_solicitante: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segundo_nombre_solicitante">Segundo Nombre</Label>
              <Input
                id="segundo_nombre_solicitante"
                readOnly
                value={solicitanteData?.segundo_nombre_solicitante || ''}
                onChange={(e) => setSolicitanteData({ ...solicitanteData, segundo_nombre_solicitante: e.target.value })}
              />
            </div>
          </div>

          {/* Grupo de Apellidos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primer_apellido_solicitante">Primer Apellido</Label>
              <Input
                id="primer_apellido_solicitante"
                readOnly
                value={solicitanteData?.primer_apellido_solicitante || ''}
                onChange={(e) => setSolicitanteData({ ...solicitanteData, primer_apellido_solicitante: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segundo_apellido_solicitante">Segundo Apellido</Label>
              <Input
                id="segundo_apellido_solicitante"
                readOnly
                value={solicitanteData?.segundo_apellido_solicitante || ''}
                onChange={(e) => setSolicitanteData({ ...solicitanteData, segundo_apellido_solicitante: e.target.value })}
              />
            </div>
          </div>

          {/* Grupo de Contacto */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección Notificación</Label>
              <Input
                id="direccion"
                readOnly={!isEditing}
                value={solicitanteData?.direccion || ''}
                onChange={(e) => setSolicitanteData({ ...solicitanteData, direccion: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                readOnly={!isEditing}
                value={solicitanteData?.email || ''}
                onChange={(e) => setSolicitanteData({ ...solicitanteData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Grupo de Ubicación */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento Notificación</Label>
              <Input
                id="departamento"
                readOnly={!isEditing}
                value={solicitanteData?.departamento || ''}
                onChange={(e) => setSolicitanteData({ ...solicitanteData, departamento: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="municipio">Municipio Notificación</Label>
              <Input
                id="municipio"
                readOnly={!isEditing}
                value={solicitanteData?.municipio || ''}
                onChange={(e) => setSolicitanteData({ ...solicitanteData, municipio: e.target.value })}
              />
            </div>
          </div>

          {/* Grupo de Teléfonos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                disabled={!isEditing}
                value={solicitanteData?.telefono || ''}
                onChange={(e) => setSolicitanteData({ ...solicitanteData, telefono: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="celular">Celular</Label>
              <Input
                id="celular"
                readOnly={!isEditing}
                value={solicitanteData?.celular || ''}
                onChange={(e) => setSolicitanteData({ ...solicitanteData, celular: e.target.value })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SolicitanteForm