import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Define the menu items
const menuItems = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", // Optional icon
  },
  
  {
    name: "PQRSD",
    icon: "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18",
    subItems: [
      { name: "Consulta de PQRSD", url: "/pqrsd/consulta/consulta" },
      { name: "Nueva PQRSD", url: "/pqrsd/nueva/nuevapqrsd" },
      { name: "Gestion de PQRSD", url: "/pqrsd/gestionpqrsd/gestionpqrsd" },
      { name: "Gestion Archivo", url: "/pqrsd/gestionarchivo/archivo" },
      { name: "Informe de PQRSD", url: "/pqrsd/informe/informepqrsd" },
      { name: "Analisis Individual", url: "/pqrsd/analisis/analisis" },
      { name: "Administrar PQRSD", url: "/pqrsd/administrarpqrsd/administrarpqrsd" },
      {
        name: "Parametricas",
        subItems: [
          { name: "Motivos de Solicitud", url: "/pqrsd/parametricas/motivos" },
        ],
      },
    ],
  },
  {
    name: "Administracion",
    icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z",
    subItems: [
      {
        name: "Organizacional",
        subItems: [
          { name: "Organizacion", url: "/administracion/organizacional/organizacion" },
          { name: "Organigrama Organizacional", url: "/administracion/organizacional/organigrama" },
          { name: "Cargos", url: "/administracion/organizacional/cargo" },
          { name: "Empleados", url: "/administracion/organizacional/empleados" },
        ],
      },
      {
        name: "Configuracion",
        url: "/administracion/configuracion"
      },
      {
        name: "Seguridad",
        subItems: [
          { name: "Usuarios", url: "/administracion/seguridad/usuarios" },
          { name: "Perfiles", url: "/administracion/seguridad/perfiles" },
          { name: "Cambiar Contraseña", url: "/administracion/seguridad/cambiar-contrasena" },
          { name: "Gestion de Menu", url: "/administracion/seguridad/gestion-menu" },
          { name: "Gestion de Firmas", url: "/administracion/seguridad/gestion-firmas" },
        ],
      },
    ],
  },
];

// MenuItem component
const MenuItem = ({ item, level = 0 }) => {
  return (
    <Collapsible>
      {item.url ? (
        <Link
          href={item.url}
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            level === 0 ? "hover:bg-primary/10" : "hover:bg-primary/5",
            level > 0 && "pl-[calc(0.75rem*1.5)]"
          )}
        >
          {level === 0 && (
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d={item.icon} />
            </svg>
          )}
          <span className="flex-1 text-left">{item.name}</span>
        </Link>
      ) : (
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            level === 0 ? "hover:bg-primary/10" : "hover:bg-primary/5",
            level > 0 && "pl-[calc(0.75rem*1.5)]"
          )}
        >
          {level === 0 && (
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d={item.icon} />
            </svg>
          )}
          <span className="flex-1 text-left">{item.name}</span>
          {item.subItems && <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
      )}
      {item.subItems && (
        <CollapsibleContent className="pl-4">
          {item.subItems.map((subItem) => (
            <MenuItem key={subItem.name} item={subItem} level={level + 1} />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

// Sidebar component
export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center gap-2 text-xl font-poppins font-bold">
        <div className="w-8 h-8">
          <svg viewBox="0 0 24 24" className="fill-current">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        DOCUMENT
      </div>

      <nav className="space-y-2">
        <div className="text-sm text-muted-foreground uppercase tracking-wide">Overview</div>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem key={item.name} item={item} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
