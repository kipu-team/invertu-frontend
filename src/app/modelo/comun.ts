// Tipos compartidos. Los valores son exactamente los enums del backend (entidades/enums).
// Las fechas llegan del backend como texto 'YYYY-MM-DD' (LocalDate).

export type Rol = 'ROLE_FREE' | 'ROLE_PREMIUM';
export type Tema = 'CLARO' | 'OSCURO' | 'SISTEMA';
export type Idioma = 'es_419' | 'en_US';
export type TipoMovimiento = 'INGRESO' | 'GASTO';
export type Clasificacion = 'FIJO' | 'VARIABLE';
export type MedioPago =
  | 'EFECTIVO'
  | 'TRANSFERENCIA'
  | 'TARJETA_DEBITO'
  | 'TARJETA_CREDITO'
  | 'BILLETERA_DIGITAL'
  | 'OTRO';
export type EstadoMeta = 'ACTIVA' | 'CUMPLIDA' | 'CANCELADA';
export type FrecuenciaAporte = 'DIARIA' | 'SEMANAL' | 'MENSUAL' | 'SIN_FRECUENCIA';
export type EstadoSuscripcion = 'ACTIVA' | 'CANCELADA';
export type FrecuenciaSuscripcion = 'SEMANAL' | 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
export type TipoEvento = 'META_LIMITE' | 'META_APORTE' | 'SUSCRIPCION';

/** MensajeResponseDTO: respuesta simple de varios endpoints (eliminar, recuperar contraseña...) */
export interface Mensaje {
  mensaje: string;
}

/** ErrorResponseDTO: cuerpo que devuelve el backend cuando algo falla (400, 403, 404, 409...) */
export interface ErrorRespuesta {
  error: string;
}
