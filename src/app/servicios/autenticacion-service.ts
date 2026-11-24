import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SesionService } from './sesion-service';
import {
  AuthRequest,
  AuthResponse,
  RecuperarContrasenaRequest,
  RegistroRequest,
  RegistroResponse,
  RestablecerContrasenaRequest,
  ValidarTokenRequest,
  ValidarTokenResponse,
} from '../modelo/autenticacion';
import { Mensaje } from '../modelo/comun';

/*
 * Autenticación | END-AUTH-01 a END-AUTH-05: /api/v1/autenticacion
 */
@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private url: string = environment.apiUrl + '/autenticacion';
  private http: HttpClient = inject(HttpClient);
  private sesionService: SesionService = inject(SesionService);

  constructor() { }

  // END-AUTH-01: registro (US-01)
  registrar(datos: RegistroRequest): Observable<RegistroResponse> {
    return this.http.post<RegistroResponse>(this.url + '/registro', datos);
  }

  // END-AUTH-02: login y almacenamiento del token (US-02)
  iniciarSesion(datos: AuthRequest, recordar: boolean): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.url + '/iniciar-sesion', datos).pipe(
      map((respuesta) => {
        this.sesionService.guardarSesion(respuesta, recordar);
        return respuesta;
      }),
    );
  }

  // END-AUTH-03: envío del enlace de recuperación (US-03)
  recuperarContrasena(datos: RecuperarContrasenaRequest): Observable<Mensaje> {
    return this.http.post<Mensaje>(this.url + '/recuperar-contrasena', datos);
  }

  // END-AUTH-04: validación del enlace (US-04)
  validarToken(datos: ValidarTokenRequest): Observable<ValidarTokenResponse> {
    return this.http.post<ValidarTokenResponse>(this.url + '/restablecer-contrasena/validar', datos);
  }

  // END-AUTH-05: nueva contraseña (US-04)
  restablecerContrasena(datos: RestablecerContrasenaRequest): Observable<Mensaje> {
    return this.http.post<Mensaje>(this.url + '/restablecer-contrasena', datos);
  }
}
