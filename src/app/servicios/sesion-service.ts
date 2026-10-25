import { Service, computed, signal } from '@angular/core';
import { EstudianteSesion } from '../modelo/autenticacion';
import { Rol } from '../modelo/comun';

/**
 * Datos del estudiante que inició sesión y su plan (Free o Premium).
 * Por ahora siempre es el usuario de prueba "Sofía". Cuando el profe enseñe seguridad (JWT),
 * aquí se guardará el token que devuelve el login.
 *
 * Uso en un componente:
 *   sesion = inject(SesionService);
 *   @if (sesion.esPremium()) { ... }
 */
@Service()
export class SesionService {
  private estudianteActual = signal<EstudianteSesion>({
    idEstudiante: 1,
    nombres: 'Sofía',
    rol: 'ROLE_FREE',
    tema: 'SISTEMA',
    idioma: 'es_419',
  });

  readonly estudiante = this.estudianteActual.asReadonly();
  readonly esPremium = computed(() => this.estudianteActual().rol === 'ROLE_PREMIUM');

  /** Después de "Pasar a Premium" */
  cambiarRol(rol: Rol): void {
    this.estudianteActual.update((e) => ({ ...e, rol }));
  }

  /** Para revisar ambas vistas: menú del avatar → "Ver como Premium / Free (prueba)" */
  alternarRol(): void {
    this.cambiarRol(this.esPremium() ? 'ROLE_FREE' : 'ROLE_PREMIUM');
  }
}
