'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

export function UploadDocumentModal({ onUploadSuccess }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const entidad = searchParams.get('entidad') || "expediente";

  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [observacion, setObservacion] = useState('');
  const [open, setOpen] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !documentName) {
      toast.error('Debes completar el nombre del documento y seleccionar un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('nombre_documento', documentName);
    formData.append('observacion', observacion);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/${entidad}/${id}/documentos`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Notificar al componente padre sobre el nuevo documento
      if (onUploadSuccess) onUploadSuccess(response.data.documento);

      toast.success('Documento subido con éxito');
      setFile(null);
      setDocumentName('');
      setObservacion('');
      setOpen(false);
    } catch (error) {
      toast.error('Error al subir el documento');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Botón para abrir el modal */}
      <Button
        variant="primary"
        className="gap-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black hover:shadow-lg hover:scale-105 transition-all duration-300"
        onClick={() => setOpen(true)}
      >
        <Upload className="h-4 w-4" />
        Subir Documento
      </Button>

      {/* Contenido del modal */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir nuevo documento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Campo para el nombre del documento */}
          <Input
            type="text"
            placeholder="Nombre del documento"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />

          {/* Campo para la observación */}
          <Input
            type="text"
            placeholder="Observación"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
          />

          {/* Campo para seleccionar el archivo */}
          <Input type="file" name="archivo" onChange={handleFileChange} />

          {/* Botón para cargar el documento */}
          <Button onClick={handleUpload} className="w-full">
            Cargar Documento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadDocumentModal;