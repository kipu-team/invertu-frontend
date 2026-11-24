import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EventoCalendario, EventosDia } from '../modelo/calendario';

/**
 * Calendario financiero (backend: /api/v1/calendario). Todo el calendario es solo Premium:
 * para Free, la pantalla muestra el bloqueo (Figura 92) sin llamar al servicio.
 */
@Service()
export class CalendarioService {
  private http: HttpClient = inject(HttpClient);
  private url = environment.apiUrl + '/calendario';

  /** mes: 1 = enero ... 12 = diciembre */
  listarEventosDelMes(anio: number, mes: number): Observable<EventoCalendario[]> {
    return this.http.get<EventoCalendario[]>(this.url, { params: { anio, mes } });
  }

  /** fecha en formato 'YYYY-MM-DD' */
  listarEventosDelDia(fecha: string): Observable<EventosDia> {
    return this.http.get<EventosDia>(this.url + '/eventos', { params: { fecha } });
  }
}
