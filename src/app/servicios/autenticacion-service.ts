import { Service } from '@angular/core';
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
import { CONTRASENA_PRUEBA, CORREO_PRUEBA, PERFIL } from './datos-prueba/datos-prueba';

/**
 * Autenticación (backend: /api/v1/autenticacion).
 * Por ahora con datos de prueba. Usuario de prueba: sofia@correo.com / Clave123*
 */
@Service()
export class AutenticacionService {
  registrar(datos: RegistroRequest): Observable<RegistroResponse> {
    // El backend responde 409 si el correo ya existe (Figuras 17 y 19)
    if (datos.correo === CORREO_PRUEBA) {
      return throwError(() => ({ status: 409, error: { error: 'El correo ya está registrado' } }));
    }
    return of({ idEstudiante: 2, nombres: datos.nombres, correo: datos.correo, rol: 'ROLE_FREE' });
  }

  iniciarSesion(datos: AuthRequest): Observable<AuthResponse> {
    // El backend responde 401 si el correo o la contraseña son incorrectos (Figura 8)
    if (datos.correo !== CORREO_PRUEBA || datos.contrasena !== CONTRASENA_PRUEBA) {
      return throwError(() => ({
        status: 401,
        error: { error: 'Correo o contraseña incorrectos' },
      }));
    }
    return of({
      token: 'token-de-prueba',
      tipo: 'Bearer',
      expiraEn: 86400,
      estudiante: {
        idEstudiante: 1,
        nombres: PERFIL.nombres,
        rol: 'ROLE_FREE',
        tema: PERFIL.tema,
        idioma: PERFIL.idioma,
      },
    });
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
