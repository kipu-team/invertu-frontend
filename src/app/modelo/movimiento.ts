import { Clasificacion, MedioPago, TipoMovimiento } from './comun';

/** POST /movimientos  y  PUT /movimientos/{id} */
export interface MovimientoRequest {
  tipo: TipoMovimiento;
  clasificacion: Clasificacion;
  descripcion: string;
  fecha: string;
  monto: number;
  idCategoria: number;
  medioPago?: MedioPago | null;
  idSuscripcion?: number | null;
  comprobanteRef?: string | null; // viene de /analisis-comprobante (registro con IA)
}

/** Respuesta de POST y PUT */
export interface Movimiento {
  idMovimiento: number;
  tipo: TipoMovimiento;
  descripcion: string;
  fecha: string;
  monto: number;
  categoria: string;
  suscripcion: string | null;
  tieneComprobante: boolean;
}

/** Cada fila del historial */
export interface MovimientoItem {
  idMovimiento: number;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: TipoMovimiento;
  clasificacion: Clasificacion;
  monto: number;
  medioPago: MedioPago | null;
  suscripcion: string | null;
  tieneComprobante: boolean;
}

/** GET /movimientos?anio=&mes=&busqueda=&tipo=&clasificacion=&idCategoria=&medioPago= */
export interface MovimientoLista {
  total: number;
  movimientos: MovimientoItem[];
}

/** Filtros opcionales del historial (todos menos anio y mes) */
export interface FiltrosMovimiento {
  anio: number;
  mes: number;
  busqueda?: string;
  tipo?: TipoMovimiento;
  clasificacion?: Clasificacion;
  idCategoria?: number;
  medioPago?: MedioPago;
}

/** GET /movimientos/{id} */
export interface MovimientoDetalle {
  idMovimiento: number;
  tipo: TipoMovimiento;
  clasificacion: Clasificacion;
  descripcion: string;
  fecha: string;
  monto: number;
  categoria: string;
  medioPago: MedioPago | null;
  suscripcion: string | null;
  urlComprobante: string | null;
}

/** POST /movimientos/analisis-comprobante (Premium, multipart con campo "archivo") */
export interface AnalisisComprobante {
  comprobanteRef: string;
  datos: {
    monto: number;
    fecha: string;
    descripcion: string;
    tipoSugerido: TipoMovimiento;
  };
}
