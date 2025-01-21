import DashboardLayout from '@/app/dashboard/layout'
import React from 'react'
import { Breadcrumb } from "@/app/componentes/breadcrumb"

const Archivo = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Gestion de Archivo</h2>
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
      </div>

    </DashboardLayout>
  )
}

export default Archivo
