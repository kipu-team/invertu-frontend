import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Aporte, AporteRequest } from '../modelo/aporte';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Service()
export class AporteService {
  private http: HttpClient = inject(HttpClient);
  private url = environment.apiUrl + '/metas';

  listar(idMeta: number): Observable<Aporte[]> {
    return this.http.get<Aporte[]>(this.url + '/' + idMeta + '/aportes');
  }

  registrar(idMeta: number, datos: AporteRequest): Observable<Aporte> {
    return this.http.post<Aporte>(this.url + '/' + idMeta + '/aportes', datos);
  }

  eliminar(idMeta: number, idAporte: number): Observable<Aporte> {
    return this.http.delete<Aporte>(this.url + '/' + idMeta+ '/aportes/' + idAporte);
  }
}
