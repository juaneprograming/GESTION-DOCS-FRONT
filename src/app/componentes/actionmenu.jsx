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
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function ActionMenu({ handleRefresh, pqrsd }) {
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [openObservaciones, setOpenObservaciones] = useState(false);
  const [openDistribucion, setOpenDistribucion] = useState(false);
  const [openTramite, setOpenTramite] = useState(false);
  const [openCierre, setOpenCierre] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/role`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserRole(response.data.role);
        console.log("User role:", response.data.role);
      } catch (error) {
        console.error("Error al obtener el rol:", error);
      } finally {
        setLoadingRole(false);
      }
    };
    fetchUserRole();
  }, []);

  const handleGestionPqrsd = async (rol, usuarioId = null) => {
    if (!rol) {
      console.error("Error: El rol no fue proporcionado");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/pqrsd/${pqrsd}/gestionar/${rol}`,
        usuarioId
          ? { 
              usuario_id: usuarioId,
              estado: rol === "Distribuidor" 
                ? "EN_DISTRIBUCION" 
                : rol === "Tramitador" 
                ? "EN_TRAMITE" 
                : "EN_CIERRE" 
            }
          : {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!usuarioId) {
        setUsuarios(response.data.usuarios);
      } else {
        handleRefresh();
  
        const actionSuccess = (action) => {
          setOpenDistribucion(false);
          setOpenTramite(false);
          setOpenCierre(false);
          alert(`PQRSd asignada exitosamente a ${action}!`);
        };
  
        switch (rol) {
          case "Radicador":
            actionSuccess("Distribuidor");
            break;
          case "Distribuidor":
            actionSuccess("Tramite");
            break;
          case "Tramitador":
            actionSuccess("Cerrador");
            break;
          default:
            console.warn("Rol no reconocido:", rol);
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
          {(userRole === "Admin" || userRole === "Radicador") && (
            <DropdownMenuItem onClick={handleDownloadSticker}>
              <Download className="h-4 w-4 mr-2" />
              Imprimir Sticker
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handlePrintRadicado}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Radicado
          </DropdownMenuItem>
          {/* Botones condicionales */}
          {(userRole === "Admin" || userRole === "Radicador") && (
            <DropdownMenuItem
              onClick={() => {
                setOpenDistribucion(true);
                handleGestionPqrsd("Distribuidor");
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar a Distribución
            </DropdownMenuItem>
          )}

          {(userRole === "Admin" || userRole === "Distribuidor") && (
            <DropdownMenuItem
              onClick={() => {
                setOpenTramite(true);
                handleGestionPqrsd("Tramitador");
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar a Trámite
            </DropdownMenuItem>
          )}

          {(userRole === "Admin" || userRole === "Tramitador") && (
            <DropdownMenuItem
              onClick={() => {
                setOpenCierre(true);
                handleGestionPqrsd("Cerrador");
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar a Cierre
            </DropdownMenuItem>
          )}
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
                  <span>{user.empleado?.nombre_1} {user.empleado?.nombre_2} {user.empleado?.apellido_1} {user.empleado?.apellido_2}</span>
                </Label>
              ))
            ) : (
              <p>No hay usuarios disponibles.</p>
            )}
          </RadioGroup>
          <Button onClick={() => handleGestionPqrsd("Distribuidor", selectedUser)} disabled={!selectedUser}>
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
                  <span>{user.empleado?.nombre_1} {user.empleado?.nombre_2} {user.empleado?.apellido_1} {user.empleado?.apellido_2}</span>
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
                  <span>{user.empleado?.nombre_1} {user.empleado?.nombre_2} {user.empleado?.apellido_1} {user.empleado?.apellido_2}</span>
                </Label>
              ))
            ) : (
              <p>No hay usuarios disponibles.</p>
            )}
          </RadioGroup>
          <Button onClick={() => handleGestionPqrsd("Cerrador", selectedUser)} disabled={!selectedUser}>
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
