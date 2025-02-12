"use client";
import React, { useEffect, useRef, useState } from "react";
import * as go from "gojs";
import axios from "axios";

const OrganigramaGoJS = () => {
  const diagramRef = useRef(null);
  const diagramInstance = useRef(null); // Referencia al diagrama de GoJS
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initDiagram = async () => {
      const $ = go.GraphObject.make;

      try {
        // Verificar que el contenedor existe
        if (!diagramRef.current) {
          throw new Error("El contenedor del diagrama no está disponible.");
        }

        // 1. Crear diagrama
        diagramInstance.current = $(go.Diagram, diagramRef.current, {
          "undoManager.isEnabled": true,
          layout: $(go.TreeLayout, {
            angle: 90,
            layerSpacing: 40,
            nodeSpacing: 25,
          }),
        });

        // 2. Configurar plantilla de nodos
        diagramInstance.current.nodeTemplate = $(
          go.Node,
          "Auto",
          {
            cursor: "pointer",
            doubleClick: (e, node) => console.log("Detalle nodo:", node.data),
          },
          $(
            go.Shape,
            "Rectangle",
            {
              fill: "#3B82F6",
              stroke: "#1E293B",
              strokeWidth: 2,
              minSize: new go.Size(180, 60),
              parameter1: 4,
            },
            new go.Binding("fill", "color")
          ),
          $(
            go.Panel,
            "Vertical",
            { margin: 8 },
            $(
              go.TextBlock,
              {
                font: "bold 14px Inter, sans-serif",
                stroke: "white",
                margin: new go.Margin(0, 0, 4, 0),
              },
              new go.Binding("text", "name")
            ),
            $(
              go.TextBlock,
              {
                font: "12px Inter, sans-serif",
                stroke: "#F8FAFC",
                opacity: 0.9,
              },
              new go.Binding("text", "employees", (e) =>
                `${e} ${e === 1 ? "colaborador" : "colaboradores"}`
              )
            )
          )
        );

        // 3. Obtener datos de la API
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/administracion/areas/organigrama`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        

        // 4. Procesar datos
        const processedData = data.data.map(node => ({
          ...node,
          color: getNodeColor(node.key)
        }));

        // 5. Configurar modelo jerárquico
        diagramInstance.current.model = new go.TreeModel({
          nodeDataArray: processedData,
          linkKeyProperty: "key",
        });

        // 6. Ajustar vista inicial
        diagramInstance.current.zoomToFit();
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    initDiagram();

    // Limpieza: Destruir el diagrama al desmontar
    return () => {
      if (diagramInstance.current) {
        diagramInstance.current.div = null;
        diagramInstance.current = null;
      }
    };
  }, []);

  const getNodeColor = (key) => {
    const depth = key.split("_").length - 1;
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#6366F1", "#EC4899"];
    return colors[depth] || "#94A3B8";
  };

  return (
    <div className="relative w-full h-[80vh] bg-white rounded-xl border shadow-sm">
      {/* Overlay de carga */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="animate-pulse text-gray-500">
            <svg
              className="animate-spin h-8 w-8 mr-3"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Overlay de error */}
      {error && (
        <div className="absolute inset-0 p-6 bg-red-50 text-red-700 rounded-lg z-10">
          <p className="font-medium">⚠️ Error al cargar el organigrama:</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      )}

      {/* Contenedor del diagrama (siempre renderizado) */}
      <div ref={diagramRef} className="w-full h-full" />
    </div>
  );
};

export default OrganigramaGoJS;