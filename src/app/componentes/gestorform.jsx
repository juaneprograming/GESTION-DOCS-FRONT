import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"

export function GestorForm({ isEditing = false }) {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [gestorData, setGestorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGestorData = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/nuevapqrsd/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        // Mantenemos los campos separados como vienen de la API
        setGestorData({
          tipo_identificacion_gestor: response.data.tipo_identificacion_gestor,
          identificacion_gestor: response.data.identificacion_gestor,
          primer_nombre_gestor: response.data.primer_nombre_gestor,
          segundo_nombre_gestor: response.data.segundo_nombre_gestor,
          primer_apellido_gestor: response.data.primer_apellido_gestor,
          segundo_apellido_gestor: response.data.segundo_apellido_gestor
        })
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

  const handleSave = async () => {
    if (!isEditing) return

    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/gestionpqrsd/${id}`,
        {
          form_type: 'gestor',
          ...gestorData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // Aquí podrías añadir una notificación de éxito
    } catch (err) {
      console.error("Error updating gestor data:", err)
      // Aquí podrías añadir una notificación de error
    }
  }

  if (loading) return <div className="p-4">Cargando datos del gestor...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <Card>
    <CardContent className="p-6">
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleSave}>
          {isEditing ? "Guardar Cambios" : "Editar Información"}
        </Button>
      </div>
      <div className="space-y-6">
        {/* Grupo de Identificación */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipo_identificacion_gestor">Tipo de Identificación</Label>
            <Input 
              id="tipo_identificacion_gestor" 
              disabled={!isEditing}
              value={gestorData?.tipo_identificacion_gestor || ''}
              onChange={(e) => setGestorData({...gestorData, tipo_identificacion_gestor: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identificacion_gestor">Número de Identificación</Label>
            <Input 
              id="identificacion_gestor" 
              disabled={!isEditing}
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
              disabled={!isEditing}
              value={gestorData?.primer_nombre_gestor || ''}
              onChange={(e) => setGestorData({...gestorData, primer_nombre_gestor: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="segundo_nombre_gestor">Segundo Nombre</Label>
            <Input 
              id="segundo_nombre_gestor" 
              disabled={!isEditing}
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
              disabled={!isEditing}
              value={gestorData?.primer_apellido_gestor || ''}
              onChange={(e) => setGestorData({...gestorData, primer_apellido_gestor: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="segundo_apellido_gestor">Segundo Apellido</Label>
            <Input 
              id="segundo_apellido_gestor" 
              disabled={!isEditing}
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