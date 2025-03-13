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
  Lock,
  Building2,
  Cog,
  PenSquare,
  X,
  Copyright,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
const gestiondocumental = {
  name: "Gestion documental",
  icon: Settings,
  subItems: [
    {
      name: "Informacion documental",
      url: "/gestiondocumental/infodocumental",
      icon: Cog,
    },
    {
      name: "Consulta documental",
      url: "/gestiondocumental/consultadocumental",
      icon: Cog,
    },
    {
      name: "Ingreso de documentos",
      url: "/gestiondocumental/ingresodocumentos",
      icon: Cog,
    },
    {
      name: "Correspondencia",
      icon: Lock,
      subItems: [
        { name: "Radicacion", url: "/gestiondocumental/correspondencia/radicacion" },
        { name: "Informe de radicados", url: "/gestiondocumental/correspondencia/informeradicados" },
        { name: "Distribucion", url: "/gestiondocumental/correspondencia/distribucion" },
        { name: "Tramite", url: "/gestiondocumental/correspondencia/tramite" },
        { name: "Consulta Integral", url: "/gestiondocumental/correspondencia/consultaintegral" },
        { name: "Miscelanea", url: "/gestiondocumental/correspondencia/miscelanea" },
      ],
    },
    {
      name: "Gestion de expedientes",
      icon: Lock,
      subItems: [
        { name: "Informe de expedientes", url: "/gestiondocumental/informeexpediente" },
        { name: "Consulta de documentos", url: "" },
      ],
    },
    {
      name: "Parametricas de actos",
      icon: Lock,
      subItems: [{ name: "Plantilla de documentos", url: "" }],
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

// Componente de Popover personalizado que se muestra al pasar el cursor
const HoverPopover = ({ trigger, content }) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="cursor-default">
          {trigger}
        </div>
      </PopoverTrigger>
      <PopoverContent onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="w-60 p-0">
        {content}
      </PopoverContent>
    </Popover>
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

  const currentYear = new Date().getFullYear()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0",
      )}
    >
      <div className="flex justify-center items-center p-4 border-b">
        <div className="font-bold text-xl text-foreground">DOC MANAGER</div>
        <button onClick={onClose} className="md:hidden">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-2 space-y-2 overflow-y-auto flex-grow">
        <MenuItem item={dashboardItem} openItems={openItems} setOpenItems={setOpenItems} />
        <MenuItem item={pqrsdItems} openItems={openItems} setOpenItems={setOpenItems} />
        <MenuItem item={administracionItems} openItems={openItems} setOpenItems={setOpenItems} />
        <MenuItem item={gestiondocumental} openItems={openItems} setOpenItems={setOpenItems} />
      </div>

      {/* Copyright section con popover */}
      <HoverPopover
        trigger={
          <div className="mt-auto border-t py-2 px-4">
            <div className="flex items-center justify-between text-xs text-foreground/60">
              <div className="flex items-center">
                <Copyright className="h-3 w-3 mr-1" />
                <span>{currentYear}</span>
              </div>
              <div className="font-medium text-primary">Enterprise Control</div>
            </div>
          </div>
        }
        content={
          <div className="bg-primary/5 p-3 text-center">
            <p className="text-xs text-foreground/70">Software desarrollado por</p>
            <p className="text-sm font-semibold text-primary">Enterprise Control</p>
            <p className="text-xs text-foreground/70 mt-1">© {currentYear} Todos los derechos reservados</p>
          </div>
        }
      />
    </aside>
  )
}

