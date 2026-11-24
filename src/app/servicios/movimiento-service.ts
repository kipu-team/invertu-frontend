import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje } from '../modelo/comun';
import {
  AnalisisComprobante,
  FiltrosMovimiento,
  Movimiento,
  MovimientoDetalle,
  MovimientoLista,
  MovimientoRequest,
} from '../modelo/movimiento';
import { environment } from '../../environments/environment';

/** Movimientos (backend: /api/v1/movimientos). */
@Service()
export class MovimientoService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/movimientos`;

  registrar(datos: MovimientoRequest): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.url, datos);
  }

  /** Historial del mes. anio y mes son obligatorios; los demás filtros solo se envían si tienen valor. */
  listar(filtros: FiltrosMovimiento): Observable<MovimientoLista> {
    let params = new HttpParams().set('anio', filtros.anio).set('mes', filtros.mes);
    if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
    if (filtros.tipo) params = params.set('tipo', filtros.tipo);
    if (filtros.clasificacion) params = params.set('clasificacion', filtros.clasificacion);
    if (filtros.idCategoria) params = params.set('idCategoria', filtros.idCategoria);
    if (filtros.medioPago) params = params.set('medioPago', filtros.medioPago);
    return this.http.get<MovimientoLista>(this.url, { params });
  }

  /** 404 si no existe o es de otro usuario. */
  obtenerDetalle(id: number): Observable<MovimientoDetalle> {
    return this.http.get<MovimientoDetalle>(`${this.url}/${id}`);
  }

  actualizar(id: number, datos: MovimientoRequest): Observable<Movimiento> {
    return this.http.put<Movimiento>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<Mensaje> {
    return this.http.delete<Mensaje>(`${this.url}/${id}`);
  }

  /** Registro con IA es solo Premium, Free recibe 403. Acepta JPG, PNG o PDF de hasta 5 MB. */
  analizarComprobante(archivo: File): Observable<AnalisisComprobante> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<AnalisisComprobante>(`${this.url}/analisis-comprobante`, formData);
  }
}
