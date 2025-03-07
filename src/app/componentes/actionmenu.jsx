import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  import { Printer, Download, Plus, Send } from "lucide-react";
  import { Observaciones } from "../pqrsd/gestionpqrsd/observaciones/page";
  import axios from "axios";
  import { useState } from "react";
  import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
  import { Label } from "@/components/ui/label";
  
  export function ActionMenu({ handleRefresh, pqrsd }) {
    const [openObservaciones, setOpenObservaciones] = useState(false);
    const [openDistribucion, setOpenDistribucion] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    
    const handleDistribucion = async (usuarioId = null) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/pqrsds/${pqrsd}/gestionar-distribucion`,
          usuarioId ? { usuario_id: usuarioId, estado: "EN_DISTRIBUCION" } : {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (!usuarioId) {
          // Si no se envió usuarioId, solo obtenemos la lista de usuarios
          setUsuarios(response.data.usuarios);
        } else {
          // Si se envió usuarioId, significa que se asignó la PQRSd
          handleRefresh();
          setOpenDistribucion(false);
          alert("PQRSd asignada exitosamente!");
        }
      } catch (error) {
        console.error("Error en la gestión de distribución:", error);
        alert("Ocurrió un error al procesar la solicitud.");
      }
<<<<<<< Updated upstream
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
=======
    };
  
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
  
        if (response.headers["content-type"] !== "application/pdf") {
          throw new Error("Respuesta no es un PDF");
        }
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `sticker-${pqrsd}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error al descargar el sticker:", error);
      }
    };
  
    return (
      <>
        <DropdownMenu>
>>>>>>> Stashed changes
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Más acciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
<<<<<<< Updated upstream
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
=======
            <DropdownMenuItem onClick={handleDownloadSticker}>
              <Download className="h-4 w-4 mr-2" />
              Imprimir Sticker
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir Radicado
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOpenDistribucion(true);
                handleDistribucion(); // Cargar usuarios al abrir modal
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar a distribución
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenObservaciones(true)}>
              <Send className="h-4 w-4 mr-2" />
              Nueva Observación
            </DropdownMenuItem>
>>>>>>> Stashed changes
          </DropdownMenuContent>
        </DropdownMenu>
  
        {/* Modal de Distribución */}
        <Dialog open={openDistribucion} onOpenChange={setOpenDistribucion}>
          <DialogContent>
            <DialogTitle>Asignar PQRSd a un usuario</DialogTitle>
            <RadioGroup onValueChange={setSelectedUser}>
              {usuarios.length > 0 ? (
                usuarios.map((user) => (
                  <Label key={user.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={user.id.toString()} />
                    <span>{user.username}</span>
                  </Label>
                ))
              ) : (
                <p>No hay usuarios disponibles.</p>
              )}
            </RadioGroup>
            <Button onClick={() => handleDistribucion(selectedUser)} disabled={!selectedUser}>
              Enviar a distribución
            </Button>
          </DialogContent>
        </Dialog>
  
        {/* Modal de Observaciones */}
        {openObservaciones && (
          <Observaciones
            open={openObservaciones}
            onOpenChange={setOpenObservaciones}
            onSuccess={() => {
              handleRefresh();
              setOpenObservaciones(false);
            }}
            pqrsdId={pqrsd}
          />
        )}
      </>
    );
  }
  