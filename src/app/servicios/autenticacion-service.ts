import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
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
import { CORREO_PRUEBA } from './datos-prueba/datos-prueba';
import { environment } from '../../environments/environment';

/**
 * Autenticación (backend: /api/v1/autenticacion).
 * iniciarSesion ya usa la API real; el resto sigue con datos de prueba.
 */
@Service()
export class AutenticacionService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/autenticacion`;

  registrar(datos: RegistroRequest): Observable<RegistroResponse> {
    // El backend responde 409 si el correo ya existe (Figuras 17 y 19)
    if (datos.correo === CORREO_PRUEBA) {
      return throwError(() => ({ status: 409, error: { error: 'El correo ya está registrado' } }));
    }
    return of({ idEstudiante: 2, nombres: datos.nombres, correo: datos.correo, rol: 'ROLE_FREE' });
  }

  /** El backend responde 401 si el correo o la contraseña son incorrectos (Figura 8). */
  iniciarSesion(datos: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/iniciar-sesion`, datos);
  }

  recuperarContrasena(datos: RecuperarContrasenaRequest): Observable<Mensaje> {
    return of({ mensaje: 'Si el correo está registrado, te enviamos un enlace de recuperación' });
  }

  /** Con el token "expirado" simula un enlace vencido (Figura 13). */
  validarToken(datos: ValidarTokenRequest): Observable<ValidarTokenResponse> {
    if (datos.token === 'expirado') {
      return of({ valido: false, mensaje: 'El enlace expiró o no es válido' });
    }
    return of({ valido: true, mensaje: 'Token válido' });
  }

  restablecerContrasena(datos: RestablecerContrasenaRequest): Observable<Mensaje> {
    return of({ mensaje: 'Contraseña restablecida' });
  }
}
