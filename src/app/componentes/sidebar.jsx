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
  X,
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
    { name: "Consulta de PQRSD", url: "/pqrsd/consulta/", icon: FileText },
    { name: "Nueva PQRSD", url: "/pqrsd/nueva/", icon: PenSquare },
    { name: "Gestion de PQRSD", url: "/pqrsd/gestionpqrsd/", icon: MessageSquare },
    { name: "Gestion Archivo", url: "/pqrsd/gestionarchivo/", icon: FileText },
    { name: "Informe de PQRSD", url: "/pqrsd/informe/", icon: FileText },
    { name: "Administrar PQRSD", url: "/pqrsd/administrarpqrsd/", icon: Settings },
    {
      name: "Parametricas",
      icon: Cog,
      subItems: [{ name: "Motivos de Solicitud", url: "/pqrsd/parametricas/", icon: FileText }],
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

export function Sidebar({ isOpen, onClose }) {
  const [openItems, setOpenItems] = useState({})

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("openItems")
      if (saved) {
        setOpenItems(JSON.parse(saved))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("openItems", JSON.stringify(openItems))
    }
  }, [openItems])

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0",
      )}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <div className="font-bold text-xl text-foreground">DOCUMENT</div>
        <button onClick={onClose} className="md:hidden">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-2 space-y-2 overflow-y-auto h-[calc(100vh-60px)]">
        <MenuItem item={dashboardItem} openItems={openItems} setOpenItems={setOpenItems} />
        <MenuItem item={pqrsdItems} openItems={openItems} setOpenItems={setOpenItems} />
        <MenuItem item={administracionItems} openItems={openItems} setOpenItems={setOpenItems} />
      </div>
    </aside>
  )
}

