import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Mensaje } from '../modelo/comun';
import {
  EstadoLimite,
  ExtenderFechaRequest,
  Meta,
  MetaDetalle,
  MetaRequest,
  MetaResumen,
  Proyeccion,
} from '../modelo/meta';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Service()
export class MetaService {
  private http: HttpClient = inject(HttpClient);
  private url = environment.apiUrl + '/metas';
  crear(datos: MetaRequest): Observable<Meta> {
    return this.http.post<Meta>(this.url, datos);
  }

  consultarEstadoLimite(): Observable<EstadoLimite> {
    return this.http.get<EstadoLimite>(this.url + '/estado-limite');
  }

  listarActivas(): Observable<MetaResumen[]> {
    return this.http.get<MetaResumen[]>(this.url + '/activas');
  }

  listarFinalizadas(): Observable<MetaResumen[]> {
    return  this.http.get<MetaResumen[]>(this.url + '/finalizadas');
  }

  obtenerDetalle(id: number): Observable<MetaDetalle> {
    return this.http.get<MetaDetalle>(this.url + '/' + id);
  }

  obtenerProyeccion(id: number): Observable<Proyeccion> {
    return this.http.get<Proyeccion>(this.url + '/' + id +'/proyeccion');
  }

  actualizar(id: number, datos: MetaRequest): Observable<Meta> {
    return this.http.put<Meta>(this.url + '/' + id, datos);
  }

  extenderFecha(id: number, datos: ExtenderFechaRequest): Observable<Meta> {
    return this.http.patch<Meta>(this.url + '/' + id + '/extender-fecha', datos);
  }

  cancelar(id: number): Observable<Meta> {
    return this.http.patch<Meta>(this.url + '/' + id + '/cancelar', {});
  }

  reactivar(id: number): Observable<Meta> {
    return this.http.patch<Meta>(this.url + '/' + id + '/reactivar', {});
  }

  eliminar(id: number): Observable<Mensaje> {
    return this.http.delete<Mensaje>(this.url + '/' + id);
  }
}
