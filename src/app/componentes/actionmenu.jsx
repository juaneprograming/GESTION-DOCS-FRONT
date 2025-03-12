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
  const [openTramite, setOpenTramite] = useState(false); // Estado para el modal de Trámite
  const [openCierre, setOpenCierre] = useState(false); // Nuevo estado para el modal de Cierre
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  

  const handleGestionPqrsd = async (rol, usuarioId = null) => {
    if (!rol) {
      console.error("Error: El rol no fue proporcionado");
      return;
    }

    try {
      console.log("Enviando rol:", rol);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${pqrsd}/gestionar/${rol}`,
        usuarioId
          ? { usuario_id: usuarioId, estado: rol === "Distribucion" ? "EN_DISTRIBUCION" : rol === "Tramitador" ? "EN_TRAMITE" : "EN_CIERRE" }
          : {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!usuarioId) {
        setUsuarios(response.data.usuarios);
      } else {
        handleRefresh();
        if (rol === "Distribucion") {
          setOpenDistribucion(false);
          alert("PQRSd asignada exitosamente a Distribución!");
        } else if (rol === "Tramitador") {
          setOpenTramite(false);
          alert("PQRSd asignada exitosamente a Trámite!");
        } else if (rol === "Cierre PQRSD") {
          setOpenCierre(false);
          alert("PQRSd asignada exitosamente a Cierre!");
        }
      }
    } catch (error) {
      console.error(`Error en la gestión de ${rol}:`, error);
      alert(`Ocurrió un error al procesar la solicitud de ${rol}.`);
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
          <DropdownMenuItem
            onClick={() => {
              setOpenDistribucion(true);
              handleGestionPqrsd("Distribucion"); // Cargar usuarios al abrir modal
            }}
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar a Distribución
          </DropdownMenuItem>
          {/* New "Enviar a Trámite" Menu Item */}
          <DropdownMenuItem
            onClick={() => {
              setOpenTramite(true);
              handleGestionPqrsd("Tramitador"); // Load users when modal opens
            }}
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar a Trámite
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setOpenCierre(true);
              handleGestionPqrsd("Cierre PQRSD"); // Load users when modal opens
            }}
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar a Cierre
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenObservaciones(true)}>
            <Plus  className="h-4 w-4 mr-2" />
            Nueva Observación
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

     {/* Modal de Distribución */}
      <Dialog open={openDistribucion} onOpenChange={setOpenDistribucion}>
        <DialogContent>
          <DialogTitle>Asignar PQRSd a un usuario de Distribución</DialogTitle>
          <RadioGroup onValueChange={setSelectedUser}>
            {usuarios.length > 0 ? (
              usuarios.map((user) => (
                <Label key={user.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={user.id.toString()} />
                  <span>{user.username} - {user.empleado?.nombre_1} {user.empleado?.nombre_2} {user.empleado?.apellido_1} {user.empleado?.apellido_2}</span>
                </Label>
              ))
            ) : (
              <p>No hay usuarios disponibles.</p>
            )}
          </RadioGroup>
          <Button onClick={() => handleGestionPqrsd("Distribucion", selectedUser)} disabled={!selectedUser}>
            Enviar a Distribución
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal de Trámite */}
      <Dialog open={openTramite} onOpenChange={setOpenTramite}>
        <DialogContent>
          <DialogTitle>Asignar PQRSd a un usuario de Trámite</DialogTitle>
          <RadioGroup onValueChange={setSelectedUser}>
            {usuarios.length > 0 ? (
              usuarios.map((user) => (
                <Label key={user.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={user.id.toString()} />
                  <span>{user.username} - {user.empleado?.nombre_1} {user.empleado?.nombre_2} {user.empleado?.apellido_1} {user.empleado?.apellido_2}</span>
                </Label>
              ))
            ) : (
              <p>No hay usuarios disponibles.</p>
            )}
          </RadioGroup>
          <Button onClick={() => handleGestionPqrsd("Tramitador", selectedUser)} disabled={!selectedUser}>
            Enviar a Trámite
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal de Trámite */}
      <Dialog open={openCierre} onOpenChange={setOpenCierre}>
        <DialogContent>
          <DialogTitle>Asignar PQRSd a un usuario de Cierre</DialogTitle>
          <RadioGroup onValueChange={setSelectedUser}>
            {usuarios.length > 0 ? (
              usuarios.map((user) => (
                <Label key={user.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={user.id.toString()} />
                  <span>{user.username} - {user.empleado?.nombre_1} {user.empleado?.nombre_2} {user.empleado?.apellido_1} {user.empleado?.apellido_2}</span>
                </Label>
              ))
            ) : (
              <p>No hay usuarios disponibles.</p>
            )}
          </RadioGroup>
          <Button onClick={() => handleGestionPqrsd("Cierre PQRSD", selectedUser)} disabled={!selectedUser}>
            Enviar a Cierre
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
