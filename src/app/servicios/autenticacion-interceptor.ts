import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SesionService } from './sesion-service';

/*
 * Interceptor JWT: header "Authorization: Bearer <token>" en cada petición a la API
 * Generado con: ng g interceptor servicios/autenticacion --skip-tests
 * Registro: app.config.ts → provideHttpClient(withInterceptors([autenticacionInterceptor]))
 */
export const autenticacionInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const sesionService = inject(SesionService);
  const token = sesionService.obtenerToken();

  // Sin token en /autenticacion (login, registro, recuperar) ni fuera de la API (i18n)
  const esApi: boolean = req.url.startsWith(environment.apiUrl);
  const esAutenticacion: boolean = req.url.startsWith(environment.apiUrl + '/autenticacion');
  const conToken: boolean = token != null && esApi && !esAutenticacion;

  // Copia de la petición con el header Authorization
  const authReq = conToken
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      switch (error.status) {

        case HttpStatusCode.Unauthorized: // 401: token vencido o inválido → cierre de sesión
          if (conToken) {
            sesionService.cerrarSesion();
            router.navigate(['/iniciar-sesion']);
          }
          return throwError(() => error);

        case HttpStatusCode.Forbidden: // 403: función Premium → mensaje en cada pantalla
          return throwError(() => error);

        default:
          return throwError(() => error);
      }
    }),
  );
};
