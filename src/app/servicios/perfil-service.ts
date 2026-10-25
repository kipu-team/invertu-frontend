import { Service, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Mensaje } from '../modelo/comun';
import {
  CambiarContrasenaRequest,
  PasarPremiumResponse,
  Perfil,
  PerfilRequest,
  Preferencias,
} from '../modelo/perfil';
import { SesionService } from './sesion-service';
import { PERFIL, PLAN_FREE, PLAN_PREMIUM } from './datos-prueba/datos-prueba';

/** Perfil del estudiante (backend: /api/v1/perfil). Por ahora con datos de prueba. */
@Service()
export class PerfilService {
  private sesion: SesionService = inject(SesionService);

  obtener(): Observable<Perfil> {
    const premium = this.sesion.esPremium();
    return of({
      ...PERFIL,
      rol: premium ? 'ROLE_PREMIUM' : 'ROLE_FREE',
      plan: premium ? PLAN_PREMIUM : PLAN_FREE,
    });
  }

  actualizar(datos: PerfilRequest): Observable<Perfil> {
    Object.assign(PERFIL, { ...datos, universidad: datos.universidad ?? null });
    return this.obtener();
  }

  actualizarPreferencias(datos: Preferencias): Observable<Preferencias> {
    Object.assign(PERFIL, datos);
    return of(datos);
  }

  cambiarContrasena(datos: CambiarContrasenaRequest): Observable<Mensaje> {
    return of({ mensaje: 'Contraseña actualizada' });
  }

  /**
   * Prueba gratuita de Premium (Figura 98). Después de llamarlo:
   *   sesion.cambiarRol(respuesta.rol)
   */
  pasarPremium(): Observable<PasarPremiumResponse> {
    return of({ rol: 'ROLE_PREMIUM', token: 'token-de-prueba', mensaje: '¡Ahora eres Premium!' });
  }
}
