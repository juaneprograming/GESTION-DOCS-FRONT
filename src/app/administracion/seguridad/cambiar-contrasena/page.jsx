import DashboardLayout from "@/app/dashboard/layout";
import { Breadcrumb } from "@/app/componentes/breadcrumb"

export default function CambiarContraseña() {
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
      </div>
    </DashboardLayout>
  );
}