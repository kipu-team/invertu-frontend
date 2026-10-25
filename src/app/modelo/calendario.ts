import { TipoEvento } from './comun';

/** GET /calendario?anio=&mes= (Premium) devuelve una lista de estos */
export interface EventoCalendario {
  fecha: string;
  tipo: TipoEvento;
  idOrigen: number; // idMeta o idSuscripcion, según el tipo
  nombre: string;
  monto: number | null;
}

/** GET /calendario/eventos?fecha=YYYY-MM-DD (Premium) */
export interface EventosDia {
  fecha: string;
  total: number;
  eventos: EventoCalendario[];
}
