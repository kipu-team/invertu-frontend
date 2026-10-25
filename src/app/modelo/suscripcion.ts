import { EstadoSuscripcion, FrecuenciaSuscripcion } from './comun';

/** POST /suscripciones  y  PUT /suscripciones/{id} */
export interface SuscripcionRequest {
  nombreServicio: string;
  monto: number;
  frecuencia: FrecuenciaSuscripcion;
  proximaFechaCobro: string;
  descripcion?: string;
}

/** Respuesta de registrar, editar, cancelar y reactivar */
export interface Suscripcion {
  idSuscripcion: number;
  nombreServicio: string;
  descripcion: string | null;
  monto: number;
  frecuencia: FrecuenciaSuscripcion;
  proximaFechaCobro: string;
  recordatorioActivo: boolean;
  diasAnticipacion: number | null;
  ultimaFechaRecordatorio: string | null;
  alertaSaldoActiva: boolean;
  ultimaFechaAlertaSaldo: string | null;
  estado: EstadoSuscripcion;
  fechaCancelacion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

/** GET /suscripciones?estado= (cada tarjeta del listado) */
export interface SuscripcionResumen {
  idSuscripcion: number;
  nombreServicio: string;
  monto: number;
  frecuencia: FrecuenciaSuscripcion;
  proximaFechaCobro: string;
  estado: EstadoSuscripcion;
  recordatorioActivo: boolean;
  pagoSinRegistrar: boolean;
}

export interface PagoSuscripcion {
  fecha: string;
  monto: number;
  medioPago: string | null;
}

/** GET /suscripciones/{id} */
export interface SuscripcionDetalle {
  idSuscripcion: number;
  nombreServicio: string;
  descripcion: string | null;
  monto: number;
  frecuencia: FrecuenciaSuscripcion;
  proximaFechaCobro: string;
  estado: EstadoSuscripcion;
  recordatorioActivo: boolean;
  diasAnticipacion: number | null;
  alertaSaldoActiva: boolean;
  pagoSinRegistrar: boolean;
  ultimaCategoria: { idCategoria: number; nombre: string } | null;
  pagos: PagoSuscripcion[]; // del más reciente al más antiguo
}

/** PATCH /suscripciones/{id}/reactivar */
export interface ReactivarSuscripcionRequest {
  proximaFechaCobro: string;
}

/** PUT /suscripciones/{id}/recordatorio */
export interface RecordatorioRequest {
  activo: boolean;
  diasAnticipacion?: number | null;
}

export interface Recordatorio {
  idSuscripcion: number;
  recordatorioActivo: boolean;
  diasAnticipacion: number | null;
}

/** PUT /suscripciones/{id}/alerta-saldo (Premium) */
export interface AlertaSaldoRequest {
  activa: boolean;
}

export interface AlertaSaldo {
  idSuscripcion: number;
  alertaSaldoActiva: boolean;
}
