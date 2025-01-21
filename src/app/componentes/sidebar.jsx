"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  ChevronRight,
  FileText,
  Users,
  Lock,
  Building2,
  Cog,
  PenSquare,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState, useEffect } from "react"

const dashboardItem = {
  name: "Dashboard",
  url: "/dashboard",
  icon: LayoutDashboard,
}

const pqrsdItems = {
  name: "PQRSD",
  icon: MessageSquare,
  subItems: [
    { name: "Consulta de PQRSD", url: "/pqrsd/consulta/consulta", icon: FileText },
    { name: "Nueva PQRSD", url: "/pqrsd/nueva/nuevapqrsd", icon: PenSquare },
    { name: "Gestion de PQRSD", url: "/pqrsd/gestionpqrsd/gestionpqrsd", icon: MessageSquare },
    { name: "Gestion Archivo", url: "/pqrsd/gestionarchivo/archivo", icon: FileText },
    { name: "Informe de PQRSD", url: "/pqrsd/informe/informepqrsd", icon: FileText },
    { name: "Analisis Individual", url: "/pqrsd/analisis/analisis", icon: FileText },
    { name: "Administrar PQRSD", url: "/pqrsd/administrarpqrsd/administrarpqrsd", icon: Settings },
    {
      name: "Parametricas",
      icon: Cog,
      subItems: [{ name: "Motivos de Solicitud", url: "/pqrsd/parametricas/motivos", icon: FileText }],
    },
  ],
}

const administracionItems = {
  name: "Administracion",
  icon: Settings,
  subItems: [
    {
      name: "Organizacional",
      icon: Building2,
      subItems: [
        { name: "Organizacion", url: "/administracion/organizacional/organizacion" },
        { name: "Organigrama Organizacional", url: "/administracion/organizacional/organigrama" },
        { name: "Cargos", url: "/administracion/organizacional/cargo" },
        { name: "Empleados", url: "/administracion/organizacional/empleados" },
      ],
    },
    {
      name: "Configuracion",
      url: "/administracion/configuracion",
      icon: Cog,
    },
    {
      name: "Seguridad",
      icon: Lock,
      subItems: [
        { name: "Usuarios", url: "/administracion/seguridad/usuarios" },
        { name: "Perfiles", url: "/administracion/seguridad/perfiles" },
        { name: "Cambiar Contraseña", url: "/administracion/seguridad/cambiar-contrasena" },
        { name: "Gestion de Menu", url: "/administracion/seguridad/gestion-menu" },
        { name: "Gestion de Firmas", url: "/administracion/seguridad/gestion-firmas" },
      ],
    },
  ],
}

const MenuItem = ({ item, level = 0, openItems, setOpenItems }) => {
  const Icon = item.icon || ChevronRight
  const pathname = usePathname()
  const isActive = item.url === pathname
  const hasSubItems = item.subItems && item.subItems.length > 0
  const isOpen = openItems[item.name]

  const toggleItem = () => {
    setOpenItems((prev) => ({
      ...prev,
      [item.name]: !prev[item.name],
    }))
  }

  return (
    <Collapsible open={isOpen} onOpenChange={toggleItem}>
      {item.url ? (
        <Link
          href={item.url}
          className={cn(
            "flex w-full items-center gap-3 px-4 py-2 text-sm text-foreground rounded-lg transition-colors mb-2",
            isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
            level > 0 && "pl-[calc(1rem*1.5)]",
          )}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="text-left">{item.name}</span>
        </Link>
      ) : (
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center gap-3 px-4 py-2 text-sm text-foreground rounded-lg transition-colors mb-2",
            isOpen ? "bg-primary/10 text-primary" : "hover:bg-muted",
            level > 0 && "pl-[calc(1rem*1.5)]",
          )}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="text-left">{item.name}</span>
          {hasSubItems && (
            <ChevronRight className={cn("w-4 h-4 ml-auto transition-transform duration-200", isOpen && "rotate-90")} />
          )}
        </CollapsibleTrigger>
      )}
      {hasSubItems && (
        <CollapsibleContent className="pl-4 space-y-2">
          {item.subItems.map((subItem) => (
            <MenuItem
              key={subItem.name}
              item={subItem}
              level={level + 1}
              openItems={openItems}
              setOpenItems={setOpenItems}
            />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}

export function Sidebar() {
  const [openItems, setOpenItems] = useState({})

  useEffect(() => {
    // Ensure that localStorage is accessed only on the client-side
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("openItems")
      if (saved) {
        setOpenItems(JSON.parse(saved))
      }
    }
  }, [])

  useEffect(() => {
    // Store the updated openItems in localStorage on the client-side
    if (typeof window !== "undefined") {
      localStorage.setItem("openItems", JSON.stringify(openItems))
    }
  }, [openItems])

  return (
    <aside className="w-64 min-h-screen border-r bg-background">
      <div className="p-4 border-b">
        <div className="flex justify-center items-center gap-2">
          <div className="font-bold text-xl text-foreground">DOCUMENT</div>
        </div>
      </div>

      <div className="p-2 space-y-2">
        <MenuItem item={dashboardItem} openItems={openItems} setOpenItems={setOpenItems} />
        <MenuItem item={pqrsdItems} openItems={openItems} setOpenItems={setOpenItems} />
        <MenuItem item={administracionItems} openItems={openItems} setOpenItems={setOpenItems} />
      </div>
    </aside>
  )
}
