import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from './sesion-service';

/**
 * T-109: si no hay token, no deja entrar a las pantallas con menú lateral y manda al login.
 * Va en la ruta padre del Layout (app.routes.ts).
 * No hay guardia Premium: eso se maneja con @if (sesion.esPremium()) y el backend responde 403.
 */
export const autenticacionGuard: CanActivateFn = () => {
  const sesion = inject(SesionService);
  const router = inject(Router);
  return sesion.estaAutenticado() ? true : router.createUrlTree(['/iniciar-sesion']);
};
