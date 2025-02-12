import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Printer, Download, Plus } from "lucide-react";
import { Observaciones } from "../pqrsd/gestionpqrsd/observaciones/page";
import axios from "axios";

export function ActionMenu({ handleRefresh, pqrsd }) {
  const handleDownloadSticker = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${pqrsd}/sticker`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    // Verificar tipo de contenido
    if (response.headers["content-type"] !== "application/pdf") {
      throw new Error("Respuesta no es un PDF");
    }

    // Crear enlace de descarga
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sticker-${pqrsd}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    // Manejar errores de PDF
    if (error.response && error.response.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        const errorData = JSON.parse(reader.result);
        console.error("Error del servidor:", errorData.error);
      };
      reader.readAsText(error.response.data);
    } else {
      console.error("Error de red o sistema:", error.message);
    }
  }
};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Más acciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDownloadSticker}>
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
  );
}


