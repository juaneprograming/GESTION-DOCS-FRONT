"use client";

import DashboardLayout from "@/app/dashboard/layout";
import { Breadcrumb } from "@/app/componentes/breadcrumb";
import OrganigramaGoJS from "@/app/componentes/OrganigramaGoJS";
import { CrearAreaForm } from "@/app/componentes/creararea";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AreaSearch from "@/app/componentes/areasearch";

export default function Organigrama() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Organigrama</h2>
            <Breadcrumb>
              {/* Ejemplo de Breadcrumb (puedes personalizarlo) */}
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
          <div className="flex space-x-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Buscar Área</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Buscar Área</DialogTitle>
                </DialogHeader>
                <AreaSearch />
              </DialogContent>
            </Dialog>
            <CrearAreaForm />
          </div>
        </div>

        {/* Contenedor del Organigrama */}
        <div className="bg-white p-6 rounded-lg shadow">
          <OrganigramaGoJS />
        </div>
      </div>
    </DashboardLayout>
  );
}