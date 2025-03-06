import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Printer, Download, Plus, Send } from "lucide-react";
import { Observaciones } from "../pqrsd/gestionpqrsd/observaciones/page";
import axios from "axios";
import { useState } from "react"; // Importa useState

export function ActionMenu({ handleRefresh, pqrsd }) {
  const [openObservaciones, setOpenObservaciones] = useState(false); // Estado para controlar el modal

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

  const handleSendToDistribution = async () => {
      try {
          const token = localStorage.getItem("token");
          // Replace '/api/send-to-distribution' with your actual API endpoint
          await axios.patch(
              `${process.env.NEXT_PUBLIC_API_URL}/pqrsds/${pqrsd}/estado`,
              { estado: 'EN_DISTRIBUCION' }, // You can send data if needed in the body of the request
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json", // Adjust content type if needed
                  },
              }
          );

          // Optionally refresh the data or show a success message
          handleRefresh();
          alert("PQRSd sent to distribution successfully!"); // Replace with a better UI notification

      } catch (error) {
          console.error("Error sending to distribution:", error);

          if (error.response && error.response.data) {
              // Log the error at the server
              console.error("Server error:", error.response.data);
              alert(`Error sending to distribution: ${error.response.data.message || "Unknown error"}`);

          }
          // Show an error message to the user
          else {
              alert("Failed to send to distribution. Check the console for details.");
          }
      }
  };

  const handlePrintRadicado = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${pqrsd}/imprimir`,
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
        link.setAttribute("download", `radicado-${pqrsd}.pdf`);
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
            console.error("Error al imprimir radicado:", error.message);
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
              <DropdownMenuItem onClick={handlePrintRadicado}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Radicado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSendToDistribution}>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar a distribución
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenObservaciones(true)}> {/* Abre el modal */}
                  <Send className="h-4 w-4 mr-2" />
                  Nueva Observacion
              </DropdownMenuItem>
          </DropdownMenuContent>
          {/* Renderiza el modal si openObservaciones es true */}
          {openObservaciones && (
              <Observaciones
                  open={openObservaciones}
                  onOpenChange={setOpenObservaciones}
                  onSuccess={() => {
                      handleRefresh();
                      setOpenObservaciones(false); // Cierra el modal después de onSuccess
                  }}
                  pqrsdId={pqrsd} // Pasa el ID del PQRSD
              />
          )}
      </DropdownMenu>
  );
}
