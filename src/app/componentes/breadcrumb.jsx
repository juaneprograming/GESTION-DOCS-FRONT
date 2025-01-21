"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Breadcrumb() {
  const pathname = usePathname()

  // Divide la ruta en partes
  const segments = pathname.split("/").filter((segment) => segment)

  // Define los segmentos que no serán enlaces
  const nonLinkSegments = ["administracion", "pqrsd", "seguridad", "organizacional"]

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {segments.map((segment, index) => {
        // Construye la URL acumulativa para cada segmento
        const url = `/${segments.slice(0, index + 1).join("/")}`

        // Capitaliza cada segmento, excepto casos específicos
        let name = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
        if (segment.toLowerCase() === "pqrsd") {
          name = "PQRSD" // Muestra "PQRSd" en mayúsculas específicas
        }

        // Último segmento: no es un enlace
        const isLast = index === segments.length - 1

        // Verifica si el segmento debe ser un enlace o texto plano
        const isNonLink = nonLinkSegments.includes(segment.toLowerCase())

        return (
          <div key={url} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            {isLast || isNonLink ? (
              <span className="text-foreground font-medium">{name}</span>
            ) : (
              <Link href={url} className={cn("hover:underline")}>
                {name}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
