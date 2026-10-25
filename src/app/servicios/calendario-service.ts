import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EventoCalendario, EventosDia } from '../modelo/calendario';
import { METAS, SUSCRIPCIONES } from './datos-prueba/datos-prueba';

/**
 * Calendario financiero (backend: /api/v1/calendario). Todo el calendario es solo Premium:
 * para Free, la pantalla muestra el bloqueo (Figura 92) sin llamar al servicio.
 * Por ahora con datos de prueba.
 */
@Service()
export class CalendarioService {
  /** mes: 1 = enero ... 12 = diciembre */
  listarEventosDelMes(anio: number, mes: number): Observable<EventoCalendario[]> {
    const prefijo = `${anio}-${String(mes).padStart(2, '0')}`;
    return of(this.todosLosEventos().filter((e) => e.fecha.startsWith(prefijo)));
  }

  /** fecha en formato 'YYYY-MM-DD' */
  listarEventosDelDia(fecha: string): Observable<EventosDia> {
    const eventos = this.todosLosEventos().filter((e) => e.fecha === fecha);
    return of({ fecha, total: eventos.length, eventos });
  }

  // Arma los eventos a partir de las metas activas y las suscripciones activas
  private todosLosEventos(): EventoCalendario[] {
    const eventos: EventoCalendario[] = [];
    METAS.filter((m) => m.estado === 'ACTIVA').forEach((m) => {
      eventos.push({
        fecha: m.fechaObjetivo,
        tipo: 'META_LIMITE',
        idOrigen: m.idMeta,
        nombre: m.nombre,
        monto: m.montoObjetivo - m.montoAportado,
      });
      if (m.proximaFechaAporte) {
        eventos.push({
          fecha: m.proximaFechaAporte,
          tipo: 'META_APORTE',
          idOrigen: m.idMeta,
          nombre: m.nombre,
          monto: null,
        });
      }
    });
    SUSCRIPCIONES.filter((s) => s.estado === 'ACTIVA').forEach((s) => {
      eventos.push({
        fecha: s.proximaFechaCobro,
        tipo: 'SUSCRIPCION',
        idOrigen: s.idSuscripcion,
        nombre: s.nombreServicio,
        monto: s.monto,
      });
    });
    return eventos;
  }
}
