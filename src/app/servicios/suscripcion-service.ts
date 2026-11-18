import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoSuscripcion, FrecuenciaSuscripcion } from '../modelo/comun';
import {
  AlertaSaldo,
  AlertaSaldoRequest,
  ReactivarSuscripcionRequest,
  Recordatorio,
  RecordatorioRequest,
  Suscripcion,
  SuscripcionDetalle,
  SuscripcionRequest,
  SuscripcionResumen,
} from '../modelo/suscripcion';
import { environment } from '../../environments/environment';

/**
 * Suscripciones (backend: /api/v1/suscripciones). T-113: todos los métodos usan la API real.
 * El token lo agrega el interceptor (autenticacion-interceptor.ts).
 */
@Service()
export class SuscripcionService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/suscripciones`;

  /** US-26. 201: creada. 400: datos inválidos. */
  registrar(datos: SuscripcionRequest): Observable<Suscripcion> {
    return this.http.post<Suscripcion>(this.url, datos);
  }

  listarFrecuencias(): Observable<FrecuenciaSuscripcion[]> {
    return this.http.get<FrecuenciaSuscripcion[]>(`${this.url}/frecuencias`);
  }

  /** US-27. Sin estado = todas. */
  listar(estado?: EstadoSuscripcion): Observable<SuscripcionResumen[]> {
    const params = estado ? new HttpParams().set('estado', estado) : undefined;
    return this.http.get<SuscripcionResumen[]>(this.url, { params });
  }

  /** US-27. 404: no existe o no es del estudiante. */
  obtenerDetalle(id: number): Observable<SuscripcionDetalle> {
    return this.http.get<SuscripcionDetalle>(`${this.url}/${id}`);
  }

  /** US-29 */
  editar(id: number, datos: SuscripcionRequest): Observable<Suscripcion> {
    return this.http.put<Suscripcion>(`${this.url}/${id}`, datos);
  }

  /** US-30 */
  cancelar(id: number): Observable<Suscripcion> {
    return this.http.patch<Suscripcion>(`${this.url}/${id}/cancelar`, {});
  }

  /** US-30. 400: la fecha no puede ser pasada. */
  reactivar(id: number, datos: ReactivarSuscripcionRequest): Observable<Suscripcion> {
    return this.http.patch<Suscripcion>(`${this.url}/${id}/reactivar`, datos);
  }

  /** US-31. Plan Free: máximo 3 recordatorios (el backend responde error si se pasa). */
  configurarRecordatorio(id: number, datos: RecordatorioRequest): Observable<Recordatorio> {
    return this.http.put<Recordatorio>(`${this.url}/${id}/recordatorio`, datos);
  }

  /** US-32. Solo Premium (403 para Free; la pantalla ya muestra el aviso Premium, Figura 65). */
  configurarAlertaSaldo(id: number, datos: AlertaSaldoRequest): Observable<AlertaSaldo> {
    return this.http.put<AlertaSaldo>(`${this.url}/${id}/alerta-saldo`, datos);
  }
}
