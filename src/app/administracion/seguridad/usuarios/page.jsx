"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit2, Plus, CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger , DialogTitle} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import  DashboardLayout  from "@/app/dashboard/layout";

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administracion/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUsers(response.data.data)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para crear el usuario
  }

  // if (loading) return <p>Loading...</p>
  // if (error) return <p>Error: {error}</p>

  return (
    <DashboardLayout>
  
    <div className="container mx-auto py-6">
      <div className="mb-4 flex justify-end">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] p-0">
            <div className="p-6">
              <DialogTitle className="text-xl font-bold mb-6">CREAR USUARIO</DialogTitle>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuario</Label>
                    <Input id="username" name="username" placeholder="Usuario" className="border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Nombre del empleado</Label>
                    <Input
                      id="employeeName"
                      name="employeeName"
                      placeholder="Nombre del empleado"
                      className="border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeWithoutUser">Empleado sin usuario</Label>
                    <Select name="employeeWithoutUser">
                      <SelectTrigger className="border-gray-200">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Opción 1</SelectItem>
                        <SelectItem value="option2">Opción 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className="border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="contraseña"
                      className="border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expirationDate">Fecha Expiración</Label>
                    <div className="relative">
                      <Input
                        id="expirationDate"
                        name="expirationDate"
                        type="date"
                        placeholder="dd/mm/aaaa"
                        className="border-gray-200"
                      />
                      <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin">Administrador</Label>
                    <Select name="admin">
                      <SelectTrigger className="border-gray-200">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select name="status">
                      <SelectTrigger className="border-gray-200">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                    Crear usuario
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Persona</TableHead>
              <TableHead>Correo electrónico</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead>Fecha Expiración</TableHead>
              <TableHead>Administrador</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.person}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.created_at}</TableCell>
                <TableCell>{user.expiresAt || "Sin fecha"}</TableCell>
                <TableCell>
                  <Badge variant={user.estado ? "default" : "secondary"}>{user.isAdmin ? "Sí" : "No"}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "success" : "destructive"}>
                    {user.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </DashboardLayout>
  )
}

export default Users

