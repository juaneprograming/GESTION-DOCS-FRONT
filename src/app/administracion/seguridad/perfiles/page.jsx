import DashboardLayout from "@/app/dashboard/layout";
import { Breadcrumb } from "@/app/componentes/breadcrumb"
import { Button } from "@/components/ui/button"
import { Edit2, Plus, Download, CalendarIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Perfiles() {
  return (
    <DashboardLayout>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Perfiles</h2>
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
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Perfil
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Perfil</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Perfil</Label>
                      <Input placeholder="Nombre de usuario" />
                    </div>
                    <div>
                      <Label>Nombre</Label>
                      <Input placeholder="Nombre del empleado" />
                    </div>
                    <div>
                      <Label>Correo</Label>
                      <Input type="email" placeholder="correo@ejemplo.com" />
                    </div>
                    <div>
                      <Label>Contraseña</Label>
                      <Input type="password" placeholder="Contraseña" />
                    </div>
                    <div>
                      <Label>Administrador</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Guardar Usuario
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}