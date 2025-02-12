"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Breadcrumb() {
  const pathname = usePathname()

  // Divide the path into segments
  const segments = pathname.split("/").filter((segment) => segment)

  // Define segments that should not be links
  const nonLinkSegments = ["administracion", "pqrsd", "seguridad", "organizacional" , "gestiondocumental", "correspondencia"]

  return (
    <nav className="flex flex-wrap items-center space-x-2 text-sm text-muted-foreground">
      {segments.map((segment, index) => {
        // Construct the cumulative URL for each segment
        const url = `/${segments.slice(0, index + 1).join("/")}`

        // Capitalize each segment, with specific exceptions
        let name = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
        if (segment.toLowerCase() === "pqrsd") {
          name = "PQRSD" // Display "PQRSD" with specific capitalization
        }

        // Determine if the segment is the last one
        const isLast = index === segments.length - 1

        // Check if the segment should be a link or plain text
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
