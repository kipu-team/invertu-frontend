import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
import { environment } from '../../environments/environment';

/**
 * Autenticación (backend: /api/v1/autenticacion).
 * Todos los métodos usan la API real (END-AUTH-01 a END-AUTH-05).
 */
@Service()
export class AutenticacionService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/autenticacion`;

  /** END-AUTH-01. 201: cuenta creada. 409: correo ya registrado. 400: datos inválidos. */
  registrar(datos: RegistroRequest): Observable<RegistroResponse> {
    return this.http.post<RegistroResponse>(`${this.url}/registro`, datos);
  }

  /** El backend responde 401 si el correo o la contraseña son incorrectos (Figura 8). */
  iniciarSesion(datos: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/iniciar-sesion`, datos);
  }

  /** END-AUTH-03. Siempre 200 (exista o no el correo). 429: debe esperar 1 minuto para reenviar. */
  recuperarContrasena(datos: RecuperarContrasenaRequest): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.url}/recuperar-contrasena`, datos);
  }

  /** END-AUTH-04. 200: enlace vigente. 400: "El enlace expiró o no es válido". El token va en el cuerpo. */
  validarToken(datos: ValidarTokenRequest): Observable<ValidarTokenResponse> {
    return this.http.post<ValidarTokenResponse>(`${this.url}/restablecer-contrasena/validar`, datos);
  }

  /** END-AUTH-05. 200: contraseña cambiada. 400: no cumple requisitos, no coinciden o enlace inválido. */
  restablecerContrasena(datos: RestablecerContrasenaRequest): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.url}/restablecer-contrasena`, datos);
  }
}
