import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Printer, Download, MessageSquarePlus, Plus } from "lucide-react"
import { Observaciones } from "../pqrsd/gestionpqrsd/observaciones/page"

export function ActionMenu( { handleRefresh, pqrsd } ) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Más acciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Download className="h-4 w-4 mr-2" />
          Imprimir Sticker
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Printer className="h-4 w-4 mr-2" />
          Imprimir Radicado
        </DropdownMenuItem>
    
          <Observaciones onSuccess={handleRefresh} pqrsdId={pqrsd} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

