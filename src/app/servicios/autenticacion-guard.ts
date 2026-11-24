import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SesionService } from './sesion-service';

/*
 * Guardia de rutas: acceso solo con sesión iniciada
 * Generado con: ng g guard servicios/autenticacion
 * Uso: app.routes.ts → canActivate: [AutenticacionGuard]
 */
@Injectable({
  providedIn: 'root',
})
export class AutenticacionGuard implements CanActivate {
  router: Router = inject(Router);
  sesionService: SesionService = inject(SesionService);

  canActivate(): boolean {
    if (this.sesionService.estaAutenticado()) {
      return true; // con token: acceso permitido
    } else {
      this.router.navigate(['/iniciar-sesion']); // sin token: redirección al login
      return false;
    }
  }
}
