import { Service, computed, signal } from '@angular/core';
import { AuthResponse, EstudianteSesion } from '../modelo/autenticacion';
import { Rol } from '../modelo/comun';

const CLAVE_TOKEN = 'invertu_token';
const CLAVE_ESTUDIANTE = 'invertu_estudiante';

/** Si nadie inició sesión, las pantallas usan a "Sofía" para poder probarlas. */
const ESTUDIANTE_PRUEBA: EstudianteSesion = {
  idEstudiante: 1,
  nombres: 'Sofía',
  rol: 'ROLE_FREE',
  tema: 'SISTEMA',
  idioma: 'es_419',
};

/**
 * Datos del estudiante que inició sesión, su plan (Free o Premium) y su token JWT.
 *
 * Uso en un componente:
 *   sesion = inject(SesionService);
 *   @if (sesion.esPremium()) { ... }
 */
@Service()
export class SesionService {
  private estudianteActual = signal<EstudianteSesion>(
    this.leerEstudianteGuardado() ?? ESTUDIANTE_PRUEBA,
  );

  readonly estudiante = this.estudianteActual.asReadonly();
  readonly esPremium = computed(() => this.estudianteActual().rol === 'ROLE_PREMIUM');

  /** Después del login. "recordar" viene del checkbox "Recuérdame". */
  guardarSesion(respuesta: AuthResponse, recordar: boolean): void {
    this.borrarGuardado();
    const almacen = recordar ? localStorage : sessionStorage;
    almacen.setItem(CLAVE_TOKEN, respuesta.token);
    almacen.setItem(CLAVE_ESTUDIANTE, JSON.stringify(respuesta.estudiante));
    this.estudianteActual.set(respuesta.estudiante);
  }

  /** El interceptor lo usa para enviar el token en cada petición. */
  obtenerToken(): string | null {
    return localStorage.getItem(CLAVE_TOKEN) ?? sessionStorage.getItem(CLAVE_TOKEN);
  }

  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }

  cerrarSesion(): void {
    this.borrarGuardado();
    this.estudianteActual.set(ESTUDIANTE_PRUEBA);
  }

  /** Después de "Pasar a Premium" */
  cambiarRol(rol: Rol): void {
    this.estudianteActual.update((e) => ({ ...e, rol }));
  }

  /** Para revisar ambas vistas: menú del avatar → "Ver como Premium / Free (prueba)" */
  alternarRol(): void {
    this.cambiarRol(this.esPremium() ? 'ROLE_FREE' : 'ROLE_PREMIUM');
  }

  private leerEstudianteGuardado(): EstudianteSesion | null {
    const texto =
      localStorage.getItem(CLAVE_ESTUDIANTE) ?? sessionStorage.getItem(CLAVE_ESTUDIANTE);
    if (!texto) {
      return null;
    }
    try {
      return JSON.parse(texto);
    } catch {
      // Si el dato guardado está dañado, se borra la sesión para que la app no se rompa
      this.borrarGuardado();
      return null;
    }
  }

  private borrarGuardado(): void {
    for (const almacen of [localStorage, sessionStorage]) {
      almacen.removeItem(CLAVE_TOKEN);
      almacen.removeItem(CLAVE_ESTUDIANTE);
    }
  }
}
