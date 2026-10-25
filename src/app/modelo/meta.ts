import { EstadoMeta, FrecuenciaAporte, Rol } from './comun';

/** POST /metas  y  PUT /metas/{id} */
export interface MetaRequest {
  nombre: string;
  montoObjetivo: number;
  fechaObjetivo: string;
  frecuenciaAporte: FrecuenciaAporte;
  descripcion?: string;
}

/** Respuesta de crear, actualizar, extender fecha, cancelar y reactivar */
export interface Meta {
  idMeta: number;
  nombre: string;
  montoObjetivo: number;
  montoAportado: number;
  fechaObjetivo: string;
  estado: EstadoMeta;
}

/** GET /metas/activas  y  GET /metas/finalizadas */
export interface MetaResumen {
  idMeta: number;
  nombre: string;
  montoObjetivo: number;
  montoAportado: number;
  porcentaje: number;
  fechaObjetivo: string;
  vencida: boolean;
  estado: EstadoMeta;
  fechaCumplimiento: string | null;
}

/** GET /metas/{id} */
export interface MetaDetalle {
  idMeta: number;
  nombre: string;
  descripcion: string | null;
  montoObjetivo: number;
  montoAportado: number;
  porcentaje: number;
  fechaObjetivo: string;
  frecuenciaAporte: FrecuenciaAporte;
  proximaFechaAporte: string | null;
  estado: EstadoMeta;
  vencida: boolean;
}

/** GET /metas/{id}/proyeccion (Premium) */
export interface Proyeccion {
  fechaEstimada: string | null;
  mensaje: string;
}

/** GET /metas/estado-limite */
export interface EstadoLimite {
  rol: Rol;
  metasActivas: number;
  limite: number | null; // null = sin límite (Premium)
  limiteAlcanzado: boolean;
}

/** PATCH /metas/{id}/extender-fecha */
export interface ExtenderFechaRequest {
  nuevaFechaObjetivo: string;
}
