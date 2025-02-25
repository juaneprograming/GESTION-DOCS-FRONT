'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { Progress } from "@/components/ui/progress";

export function UploadDocumentModal({ onUploadSuccess, setDocumentosRefresh }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const entidad = searchParams.get('entidad') || "expediente";

  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [observacion, setObservacion] = useState('');
  const [open, setOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    // Mostrar el tamaño del archivo seleccionado
    if (selectedFile) {
      const fileSizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      console.log(`Tamaño del archivo: ${fileSizeInMB} MB`);
    }
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
      setUploadProgress(1);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/${entidad}/${id}/documentos`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              // Calculamos el progreso basado en el tamaño del archivo
              const loaded = progressEvent.loaded;
              const total = progressEvent.total;
              
              // Ajustamos la velocidad del progreso según el tamaño del archivo
              const fileSizeInMB = total / (1024 * 1024);
              let delay = 0;
              
              // Ajustamos el delay según el tamaño
              if (fileSizeInMB < 1) delay = 100; // archivos pequeños
              else if (fileSizeInMB < 5) delay = 200; // archivos medianos
              else delay = 300; // archivos grandes
              
              const percentCompleted = Math.round((loaded * 100) / total);
              
              setTimeout(() => {
                setUploadProgress(percentCompleted);
              }, delay);
            }
          },
        }
      );
      setUploadProgress(100);

      setTimeout(() => {
        if (onUploadSuccess) onUploadSuccess(response.data.documento);
        toast.success('Documento subido con éxito');
        setFile(null);
        setDocumentName('');
        setObservacion('');
        setUploadProgress(0);
        setDocumentosRefresh(prev => !prev); // Actualizar el estado para refrescar
        setOpen(false);
      }, 500);
    } catch (error) {
      setUploadProgress(0);
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
          <div className="space-y-2">
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full space-y-1">
                <Progress value={uploadProgress} className="w-full h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  Subiendo... {uploadProgress}%
                </p>
              </div>
            )}
            <Button
              onClick={handleUpload}
              className="w-full"
              disabled={uploadProgress > 0 && uploadProgress < 100}
            >
              {uploadProgress > 0 && uploadProgress < 100
                ? 'Subiendo documento...'
                : 'Cargar Documento'
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadDocumentModal;