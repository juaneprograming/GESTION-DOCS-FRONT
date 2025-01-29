import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"

export function SolicitanteFormConsulta({ isEditing = false }) {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [solicitanteData, setSolicitanteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSolicitanteData = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        setSolicitanteData({
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
          email: response.data.email
        })
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

  const handleSave = async () => {
    if (!isEditing) return

    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/gestionpqrsd/${id}`,
        {
          form_type: 'solicitantes',
          ...solicitanteData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // Aquí podrías añadir una notificación de éxito
    } catch (err) {
      console.error("Error updating solicitante data:", err)
      // Aquí podrías añadir una notificación de error
    }
  }

  if (loading) return <div className="p-4">Cargando datos del solicitante...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Grupo de Identificación */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_identificacion_solicitante">Tipo de Identificación</Label>
              <Input 
                id="tipo_identificacion_solicitante" 
                readOnly
                value={solicitanteData?.tipo_identificacion_solicitante || ''}
                onChange={(e) => setSolicitanteData({...solicitanteData, tipo_identificacion_solicitante: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identificacion_solicitante">Número de Identificación</Label>
              <Input 
                id="identificacion_solicitante" 
                readOnly
                value={solicitanteData?.identificacion_solicitante || ''}
                onChange={(e) => setSolicitanteData({...solicitanteData, identificacion_solicitante: e.target.value})}
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
                onChange={(e) => setSolicitanteData({...solicitanteData, primer_nombre_solicitante: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segundo_nombre_solicitante">Segundo Nombre</Label>
              <Input 
                id="segundo_nombre_solicitante" 
                readOnly
                value={solicitanteData?.segundo_nombre_solicitante || ''}
                onChange={(e) => setSolicitanteData({...solicitanteData, segundo_nombre_solicitante: e.target.value})}
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
                onChange={(e) => setSolicitanteData({...solicitanteData, primer_apellido_solicitante: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segundo_apellido_solicitante">Segundo Apellido</Label>
              <Input 
                id="segundo_apellido_solicitante" 
                readOnly
                value={solicitanteData?.segundo_apellido_solicitante || ''}
                onChange={(e) => setSolicitanteData({...solicitanteData, segundo_apellido_solicitante: e.target.value})}
              />
            </div>
          </div>

          {/* Grupo de Contacto */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección Notificación</Label>
              <Input 
                id="direccion" 
                readOnly
                value={solicitanteData?.direccion || ''}
                onChange={(e) => setSolicitanteData({...solicitanteData, direccion: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                readOnly
                value={solicitanteData?.email || ''}
                onChange={(e) => setSolicitanteData({...solicitanteData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Grupo de Ubicación */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento Notificación</Label>
              <Input 
                id="departamento" 
                readOnly
                value={solicitanteData?.departamento || ''}
                onChange={(e) => setSolicitanteData({...solicitanteData, departamento: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="municipio">Municipio Notificación</Label>
              <Input 
                id="municipio" 
                readOnly
                value={solicitanteData?.municipio || ''}
                onChange={(e) => setSolicitanteData({...solicitanteData, municipio: e.target.value})}
              />
            </div>
          </div>

          {/* Grupo de Teléfonos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input 
                id="telefono" 
                readOnly
                value={solicitanteData?.telefono || ''}
                onChange={(e) => setSolicitanteData({...solicitanteData, telefono: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="celular">Celular</Label>
              <Input 
                id="celular" 
                readOnly
                value={solicitanteData?.celular || ''}
                onChange={(e) => setSolicitanteData({...solicitanteData, celular: e.target.value})}
              />
            </div>
          </div>
        </div>
      </CardContent>
  )
}

export default SolicitanteFormConsulta