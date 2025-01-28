"use client"

import DashboardLayout from "@/app/dashboard/layout"
import { Breadcrumb } from "@/app/componentes/breadcrumb"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// Simulación de datos de usuarios
const users = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Usuario ${i + 1}`,
}))

export default function CambiarContraseña() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [newPassword, setNewPassword] = useState("")

  const handleUserSelect = (userName) => {
    setSelectedUser(userName)
    setNewPassword("")
  }

  const handlePasswordChange = () => {
    // Aquí iría la lógica para cambiar la contraseña
    console.log(`Cambiando contraseña para ${selectedUser} a: ${newPassword}`)
    setNewPassword("")
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Cambiar Contraseña</h2>
            <Breadcrumb>
              {/* <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Administración</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Cargos</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList> */}
            </Breadcrumb>
          </div>
        </div>

        <Card className="w-full max-w-4xl mx-auto">
          <div className="flex h-[500px]">
            {/* Lista de usuarios (lado izquierdo) */}
            <div className="w-1/3 border-r border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4">Usuarios</h2>
              <ScrollArea className="h-[420px]">
                <div className="space-y-2">
                  {users.map((user) => (
                    <Button
                      key={user.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleUserSelect(user.name)}
                    >
                      {user.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Formulario de cambio de contraseña (lado derecho) */}
            <div className="w-2/3 p-4">
              <h2 className="text-lg font-semibold mb-4">Cambiar Contraseña</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="selectedUser" className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario Seleccionado
                  </label>
                  <Input id="selectedUser" value={selectedUser || ""} readOnly className="bg-gray-100" />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ingrese la nueva contraseña"
                  />
                </div>
                <Button onClick={handlePasswordChange} disabled={!selectedUser || !newPassword} className="w-full">
                  Cambiar Contraseña
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

