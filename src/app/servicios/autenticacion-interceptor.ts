import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SesionService } from './sesion-service';

/**
 * Agrega "Authorization: Bearer <token>" a cada petición a la API.
 * No lo agrega en /autenticacion (login, registro, recuperar), que no necesitan token,
 * ni en otras peticiones (por ejemplo, los archivos i18n).
 *
 * Si el backend responde 401 (token vencido o inválido), borra la sesión y manda al login.
 */
export const autenticacionInterceptor: HttpInterceptorFn = (req, next) => {
  const sesion = inject(SesionService);
  const router = inject(Router);
  const token = sesion.obtenerToken();
  const esApi = req.url.startsWith(environment.apiUrl);
  const esAutenticacion = req.url.startsWith(`${environment.apiUrl}/autenticacion`);

  if (!token || !esApi || esAutenticacion) {
    return next(req); // sale tal cual
  }

  const conToken = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(conToken).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        sesion.cerrarSesion();
        router.navigate(['/iniciar-sesion']);
      }
      // El error sigue hasta el componente, para que pueda apagar su "cargando"
      return throwError(() => error);
    }),
  );
};
