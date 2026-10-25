import { EstadoMeta } from './comun';

/** POST /metas/{idMeta}/aportes */
export interface AporteRequest {
  monto: number;
  fecha: string;
  descripcion?: string;
}

/** GET /metas/{idMeta}/aportes (lista), POST y DELETE devuelven uno */
export interface Aporte {
  idAporte: number;
  fecha: string;
  monto: number;
  descripcion: string | null;
  // estado de la meta después del aporte:
  montoAportado: number;
  porcentaje: number;
  estadoMeta: EstadoMeta;
}
