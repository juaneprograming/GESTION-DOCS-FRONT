'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit2, Plus } from 'lucide-react'

const users = [
  {
    id: "1",
    username: "johndoe",
    person: "John Doe",
    email: "john@example.com",
    createdAt: "2024-02-15",
    expiresAt: "2025-02-15",
    isAdmin: true,
    isActive: true,
  },
  // Agrega más usuarios según sea necesario
];

export default function Usuarios() {
  const [filters, setFilters] = useState({
    username: "",
    person: "",
    email: "",
    createdAt: "",
    expiresAt: "",
    isAdmin: "",
    isActive: "",
  })

  const filteredUsers = users.filter(user => {
    return (
      user.username.toLowerCase().includes(filters.username.toLowerCase()) &&
      user.person.toLowerCase().includes(filters.person.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.createdAt.includes(filters.createdAt) &&
      user.expiresAt.includes(filters.expiresAt) &&
      (filters.isAdmin === "" || user.isAdmin.toString() === filters.isAdmin) &&
      (filters.isActive === "" || user.isActive.toString() === filters.isActive)
    )
  })

  return (
    
    <div className="container mx-auto py-6">
      <div>
        <h2 className="text-xl font-bold">Usuario</h2>
        <p>Esta es la vista de Usuario.</p>
      </div>
      <div className="mb-4 flex justify-end">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Crear Usuario</span>
        </Button>
      </div>
      <div className="rounded-lg border bg-card shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Input
                  placeholder="Usuario"
                  value={filters.username}
                  onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                  className="max-w-[150px]"
                />
              </TableHead>
              <TableHead>
                <Input
                  placeholder="Persona"
                  value={filters.person}
                  onChange={(e) => setFilters({ ...filters, person: e.target.value })}
                  className="max-w-[150px]"
                />
              </TableHead>
              <TableHead>
                <Input
                  placeholder="Correo electrónico"
                  value={filters.email}
                  onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                  className="max-w-[200px]"
                />
              </TableHead>
              <TableHead>
                <Input
                  placeholder="Fecha Creación"
                  type="date"
                  value={filters.createdAt}
                  onChange={(e) => setFilters({ ...filters, createdAt: e.target.value })}
                  className="max-w-[150px]"
                />
              </TableHead>
              <TableHead>
                <Input
                  placeholder="Fecha Expiración"
                  type="date"
                  value={filters.expiresAt}
                  onChange={(e) => setFilters({ ...filters, expiresAt: e.target.value })}
                  className="max-w-[150px]"
                />
              </TableHead>
              <TableHead>
                <select
                  className="w-full max-w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={filters.isAdmin}
                  onChange={(e) => setFilters({ ...filters, isAdmin: e.target.value })}
                >
                  <option value="">Administrador</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </TableHead>
              <TableHead>
                <select
                  className="w-full max-w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={filters.isActive}
                  onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                >
                  <option value="">Activo</option>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.person}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>{user.expiresAt}</TableCell>
                <TableCell>
                  <Badge variant={user.isAdmin ? "default" : "secondary"}>
                    {user.isAdmin ? "Sí" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "success" : "secondary"}>
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
  )
}

