import { Categoria } from '../../modelo/categoria';
import { MovimientoItem } from '../../modelo/movimiento';
import { MetaDetalle } from '../../modelo/meta';
import { Aporte } from '../../modelo/aporte';
import { SuscripcionDetalle } from '../../modelo/suscripcion';
import { Perfil } from '../../modelo/perfil';

/** Fecha 'YYYY-MM-DD' a N días de hoy (negativo = pasado). */
export function fechaRelativa(dias: number): string {
  const f = new Date();
  f.setDate(f.getDate() + dias);
  const mm = String(f.getMonth() + 1).padStart(2, '0');
  const dd = String(f.getDate()).padStart(2, '0');
  return `${f.getFullYear()}-${mm}-${dd}`;
}

/** Siguiente id libre de una lista (para "registrar"). */
export function siguienteId<T>(lista: T[], campo: keyof T): number {
  return lista.reduce((max, x) => Math.max(max, Number(x[campo])), 0) + 1;
}

/*
 * Datos de prueba en memoria. Se reinician al recargar la página.
 * Los campos son los mismos que devuelve el backend, para que al conectar la API
 * las pantallas no tengan que cambiar.
 *
 * Usuario de prueba para iniciar sesión:  sofia@correo.com  /  Clave123*
 *
 * Cuando el profe enseñe HTTP, esta carpeta se borra y los servicios llaman a la API.
 */

export const CORREO_PRUEBA = 'sofia@correo.com';
export const CONTRASENA_PRUEBA = 'Clave123*';

export const PERFIL: Perfil = {
  nombres: 'Sofía',
  apellidos: 'Martínez',
  correo: CORREO_PRUEBA,
  universidad: 'Universidad Privada',
  tema: 'SISTEMA',
  idioma: 'es_419',
  rol: 'ROLE_FREE',
  plan: { precioMensual: 0, maxMetasActivas: 2, maxRecordatorios: 2 },
};

export const PLAN_PREMIUM = { precioMensual: 9.9, maxMetasActivas: null, maxRecordatorios: null };
export const PLAN_FREE = { precioMensual: 0, maxMetasActivas: 2, maxRecordatorios: 2 };

export const CATEGORIAS: Categoria[] = [
  { idCategoria: 1, nombre: 'Alimentación', personalizada: false },
  { idCategoria: 2, nombre: 'Transporte', personalizada: false },
  { idCategoria: 3, nombre: 'Universidad', personalizada: false },
  { idCategoria: 4, nombre: 'Entretenimiento', personalizada: false },
  { idCategoria: 5, nombre: 'Mesada', personalizada: false },
  { idCategoria: 6, nombre: 'Trabajo', personalizada: false },
  { idCategoria: 7, nombre: 'Suscripciones', personalizada: false },
  { idCategoria: 8, nombre: 'Fotocopias', personalizada: true },
];

export const MOVIMIENTOS: MovimientoItem[] = [
  {
    idMovimiento: 1,
    fecha: fechaRelativa(-20),
    descripcion: 'Mesada del mes',
    categoria: 'Mesada',
    tipo: 'INGRESO',
    clasificacion: 'FIJO',
    monto: 800,
    medioPago: 'TRANSFERENCIA',
    suscripcion: null,
    tieneComprobante: false,
  },
  {
    idMovimiento: 2,
    fecha: fechaRelativa(-15),
    descripcion: 'Pago por clases particulares',
    categoria: 'Trabajo',
    tipo: 'INGRESO',
    clasificacion: 'VARIABLE',
    monto: 450,
    medioPago: 'BILLETERA_DIGITAL',
    suscripcion: null,
    tieneComprobante: false,
  },
  {
    idMovimiento: 3,
    fecha: fechaRelativa(-12),
    descripcion: 'Menú en la cafetería',
    categoria: 'Alimentación',
    tipo: 'GASTO',
    clasificacion: 'VARIABLE',
    monto: 14.5,
    medioPago: 'EFECTIVO',
    suscripcion: null,
    tieneComprobante: false,
  },
  {
    idMovimiento: 4,
    fecha: fechaRelativa(-10),
    descripcion: 'Recarga tarjeta de bus',
    categoria: 'Transporte',
    tipo: 'GASTO',
    clasificacion: 'FIJO',
    monto: 50,
    medioPago: 'BILLETERA_DIGITAL',
    suscripcion: null,
    tieneComprobante: true,
  },
  {
    idMovimiento: 5,
    fecha: fechaRelativa(-8),
    descripcion: 'Spotify Premium',
    categoria: 'Suscripciones',
    tipo: 'GASTO',
    clasificacion: 'FIJO',
    monto: 9.9,
    medioPago: 'TARJETA_DEBITO',
    suscripcion: 'Spotify',
    tieneComprobante: false,
  },
  {
    idMovimiento: 6,
    fecha: fechaRelativa(-5),
    descripcion: 'Libro de cálculo',
    categoria: 'Universidad',
    tipo: 'GASTO',
    clasificacion: 'VARIABLE',
    monto: 65,
    medioPago: 'TARJETA_DEBITO',
    suscripcion: null,
    tieneComprobante: true,
  },
  {
    idMovimiento: 7,
    fecha: fechaRelativa(-2),
    descripcion: 'Fotocopias del curso',
    categoria: 'Fotocopias',
    tipo: 'GASTO',
    clasificacion: 'VARIABLE',
    monto: 8,
    medioPago: 'EFECTIVO',
    suscripcion: null,
    tieneComprobante: false,
  },
];

export const METAS: MetaDetalle[] = [
  {
    idMeta: 1,
    nombre: 'Fondo de emergencia',
    descripcion: 'Para imprevistos del ciclo',
    montoObjetivo: 1000,
    montoAportado: 350,
    porcentaje: 35,
    fechaObjetivo: fechaRelativa(90),
    frecuenciaAporte: 'MENSUAL',
    proximaFechaAporte: fechaRelativa(10),
    estado: 'ACTIVA',
    vencida: false,
  },
  {
    idMeta: 2,
    nombre: 'Laptop nueva',
    descripcion: null,
    montoObjetivo: 3000,
    montoAportado: 1200,
    porcentaje: 40,
    fechaObjetivo: fechaRelativa(-3),
    frecuenciaAporte: 'SEMANAL',
    proximaFechaAporte: null,
    estado: 'ACTIVA',
    vencida: true,
  },
  {
    idMeta: 3,
    nombre: 'Viaje a Cusco',
    descripcion: 'Vacaciones de verano',
    montoObjetivo: 800,
    montoAportado: 800,
    porcentaje: 100,
    fechaObjetivo: fechaRelativa(-30),
    frecuenciaAporte: 'MENSUAL',
    proximaFechaAporte: null,
    estado: 'CUMPLIDA',
    vencida: false,
  },
];

/** Aportes por idMeta */
export const APORTES: Record<number, Aporte[]> = {
  1: [
    {
      idAporte: 1,
      fecha: fechaRelativa(-40),
      monto: 200,
      descripcion: 'Primer aporte',
      montoAportado: 200,
      porcentaje: 20,
      estadoMeta: 'ACTIVA',
    },
    {
      idAporte: 2,
      fecha: fechaRelativa(-10),
      monto: 150,
      descripcion: null,
      montoAportado: 350,
      porcentaje: 35,
      estadoMeta: 'ACTIVA',
    },
  ],
  2: [
    {
      idAporte: 3,
      fecha: fechaRelativa(-20),
      monto: 1200,
      descripcion: 'Gratificación',
      montoAportado: 1200,
      porcentaje: 40,
      estadoMeta: 'ACTIVA',
    },
  ],
  3: [
    {
      idAporte: 4,
      fecha: fechaRelativa(-35),
      monto: 800,
      descripcion: null,
      montoAportado: 800,
      porcentaje: 100,
      estadoMeta: 'CUMPLIDA',
    },
  ],
};

export const SUSCRIPCIONES: SuscripcionDetalle[] = [
  {
    idSuscripcion: 1,
    nombreServicio: 'Spotify',
    descripcion: 'Plan estudiante',
    monto: 9.9,
    frecuencia: 'MENSUAL',
    proximaFechaCobro: fechaRelativa(22),
    estado: 'ACTIVA',
    recordatorioActivo: true,
    diasAnticipacion: 3,
    alertaSaldoActiva: false,
    pagoSinRegistrar: false,
    ultimaCategoria: { idCategoria: 7, nombre: 'Suscripciones' },
    pagos: [{ fecha: fechaRelativa(-8), monto: 9.9, medioPago: 'TARJETA_DEBITO' }],
  },
  {
    idSuscripcion: 2,
    nombreServicio: 'Netflix',
    descripcion: null,
    monto: 24.9,
    frecuencia: 'MENSUAL',
    proximaFechaCobro: fechaRelativa(4),
    estado: 'ACTIVA',
    recordatorioActivo: false,
    diasAnticipacion: null,
    alertaSaldoActiva: false,
    pagoSinRegistrar: true,
    ultimaCategoria: null,
    pagos: [],
  },
  {
    idSuscripcion: 3,
    nombreServicio: 'Canva Pro',
    descripcion: null,
    monto: 120,
    frecuencia: 'ANUAL',
    proximaFechaCobro: fechaRelativa(150),
    estado: 'CANCELADA',
    recordatorioActivo: false,
    diasAnticipacion: null,
    alertaSaldoActiva: false,
    pagoSinRegistrar: false,
    ultimaCategoria: null,
    pagos: [],
  },
];

export const RESPUESTAS_CHATBOT: string[] = [
  'Este mes llevas gastado S/ 147.40. Tu categoría con más gasto es Universidad (S/ 65.00).',
  'Si mantienes tus aportes mensuales, cumplirías tu meta "Fondo de emergencia" en unos 4 meses.',
  'Tienes 1 suscripción con cobro en los próximos 7 días: Netflix (S/ 24.90).',
];
