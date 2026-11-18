import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Mensaje } from '../modelo/comun';
import {
  CambiarContrasenaRequest,
  PasarPremiumResponse,
  Perfil,
  PerfilRequest,
  Preferencias,
} from '../modelo/perfil';

/** Perfil del estudiante (backend: /api/v1/perfil). */
@Service()
export class PerfilService {
  private http: HttpClient = inject(HttpClient);
  private url = environment.apiUrl + '/perfil';

  obtener(): Observable<Perfil> {
    return this.http.get<Perfil>(this.url);
  }

  actualizar(datos: PerfilRequest): Observable<Perfil> {
    return this.http.put<Perfil>(this.url, datos);
  }

  actualizarPreferencias(datos: Preferencias): Observable<Preferencias> {
    return this.http.put<Preferencias>(this.url + '/preferencias', datos);
  }

  cambiarContrasena(datos: CambiarContrasenaRequest): Observable<Mensaje> {
    return this.http.put<Mensaje>(this.url + '/contrasena', datos);
  }

  pasarPremium(): Observable<PasarPremiumResponse> {
    return this.http.post<PasarPremiumResponse>(this.url + '/pasar-premium', {});
  }
}
