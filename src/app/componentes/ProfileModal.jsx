"use client"

import { useState, useEffect } from "react"
import { X, Upload, Trash2 } from "lucide-react"
import api from "@/app/api/axios"
import { Button } from "@/components/ui/button";

export default function ProfileModal({ isOpen, onClose, user }) {
  const [profileName, setProfileName] = useState("")
  const [username, setUsername] = useState("")
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [bgColor, setBgColor] = useState("bg-blue-500")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileName(user.empleado?.nombre || "")
      setUsername(user.username || "")

      if (user.empleado?.foto) {
        setImagePreview(user.empleado.foto)
      }
    }
  }, [user])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteImage = () => {
    setProfileImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("nombre", profileName)

      if (profileImage) {
        formData.append("foto", profileImage)
      } else if (imagePreview === null) {
        // Si se eliminó la imagen
        formData.append("eliminarFoto", "true")
      }

      const response = await api.post("/updateProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        // Actualizar la información del usuario en el componente padre
        onClose(true) // true indica que se actualizó el perfil
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Mi Perfil</h2>
          <button onClick={() => onClose(false)} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Imagen de perfil */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Foto de perfil</label>
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover border"
                  />
                ) : (
                  <div
                    className={`h-24 w-24 rounded-full flex items-center justify-center ${bgColor} text-white font-bold text-2xl`}
                  >
                    {username ? username.charAt(0).toUpperCase() : ""}
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <label className="cursor-pointer px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center space-x-1 text-sm">
                  <Upload className="h-4 w-4" />
                  <span>Cambiar foto</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteImage}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </Button>
              </div>
            </div>
          </div>

         

          {/* Nombre de usuario (no editable) */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Nombre de usuario
            </label>
            <div className="flex items-center w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500">
              <span className="text-gray-400">@</span>
              <span className="ml-1">{username}</span>
            </div>
            <p className="text-xs text-gray-500">El nombre de usuario no se puede editar</p>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-3 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

