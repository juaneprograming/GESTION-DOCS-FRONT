import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ContratoForm = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


    
      {/* Número del Contrato */}
      <div className="space-y-2">
        <Label>Número del contrato *</Label>
        <Input
          value={data.numero_contrato}
          onChange={(e) => onChange('numero_contrato', e.target.value)}
          required
        />
      </div>
        
      {/* Fecha de Firma */}
      <div className="space-y-2">
        <Label>Fecha de firma *</Label>
        <Input
          type="date"
          value={data.fecha_firma}
          onChange={(e) => onChange('fecha_firma', e.target.value)}
          required
        />
      </div>

      {/* Empresa Involucrada */}
      <div className="space-y-2">
        <Label>Empresa involucrada (NIT) *</Label>
        <Input
          value={data.empresa_involucrada}
          onChange={(e) => onChange('empresa_involucrada', e.target.value)}
          required
        />
      </div>

      {/* Año */}
      <div className="space-y-2">
        <Label>Año *</Label>
        <Input
          type="number"
          value={data.anio}
          onChange={(e) => onChange('anio', e.target.value)}
          required
        />
      </div>

      {/* Valor del Contrato */}
      <div className="space-y-2">
        <Label>Valor del contrato *</Label>
        <Input
          type="number"
          value={data.valor_contrato}
          onChange={(e) => onChange('valor_contrato', e.target.value)}
          required
        />
      </div>

      {/* Objeto */}
      <div className="space-y-2">
        <Label>Objeto *</Label>
        <Input
          value={data.objeto}
          onChange={(e) => onChange('objeto', e.target.value)}
          required
        />
      </div>

      {/* Obligaciones del Contratista */}
      <div className="space-y-2">
        <Label>Obligaciones del contratista *</Label>
        <Input
          value={data.obligaciones_contratista}
          onChange={(e) => onChange('obligaciones_contratista', e.target.value)}
          required
        />
      </div>

      {/* Plazo de Ejecución */}
      <div className="space-y-2">
        <Label>Plazo de ejecución *</Label>
        <Input
          value={data.plazo_ejecucion}
          onChange={(e) => onChange('plazo_ejecucion', e.target.value)}
          required
        />
      </div>
    </div>
    
  );
};

export default ContratoForm;