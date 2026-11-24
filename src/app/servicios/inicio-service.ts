import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Graficos, Indicadores, Orientacion } from '../modelo/inicio';
import { environment } from '../../environments/environment';

/*conexión actualizada*/
@Service()
export class InicioService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/inicio`;

  obtenerOrientacion(): Observable<Orientacion> {
    return this.http.get<Orientacion>(`${this.url}/orientacion`);
  }

  obtenerIndicadores(anio: number, mes: number): Observable<Indicadores> {
    return this.http.get<Indicadores>(`${this.url}/indicadores`, {
      params: { anio, mes },
    });
  }

  obtenerGraficos(anio: number, mes: number): Observable<Graficos> {
    return this.http.get<Graficos>(`${this.url}/graficos`, {
      params: { anio, mes },
    });
  }
}
