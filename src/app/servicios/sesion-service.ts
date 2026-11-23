import { Injectable } from '@angular/core';
import { AuthResponse, EstudianteSesion } from '../modelo/autenticacion';
import { Rol } from '../modelo/comun';

/*
 * Sesión del estudiante: token JWT y datos básicos (nombre y rol)
 * Recordarme marcado: localStorage | sin marcar: sessionStorage (US-02)
 */
@Injectable({
  providedIn: 'root',
})
export class SesionService {
  // Prefijo invertu_ para no mezclarse con otros proyectos en localhost:4200
  private claveToken: string = 'invertu_token';
  private claveEstudiante: string = 'invertu_estudiante';

  private estudianteVacio: EstudianteSesion = {
    idEstudiante: 0,
    nombres: '',
    rol: 'ROLE_FREE',
    tema: 'SISTEMA',
    idioma: 'es_419',
  };

  private estudianteActual: EstudianteSesion = this.leerEstudiante() ?? this.estudianteVacio;

  constructor() { }

  // Login exitoso: almacenamiento del token y del estudiante (US-02 E1)
  guardarSesion(respuesta: AuthResponse, recordar: boolean): void {
    this.borrarAlmacenamiento();

    const almacen = recordar ? localStorage : sessionStorage;
    almacen.setItem(this.claveToken, respuesta.token);
    almacen.setItem(this.claveEstudiante, JSON.stringify(respuesta.estudiante));

    this.estudianteActual = respuesta.estudiante;
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.claveToken) ?? sessionStorage.getItem(this.claveToken);
  }

  estaAutenticado(): boolean {
    return this.obtenerToken() != null;
  }

  estudiante(): EstudianteSesion {
    return this.estudianteActual;
  }

  esPremium(): boolean {
    return this.estudianteActual.rol === 'ROLE_PREMIUM';
  }

  // Cierre de sesión (US-40) o token vencido (401)
  cerrarSesion(): void {
    this.borrarAlmacenamiento();
    this.estudianteActual = this.estudianteVacio;
  }

  cambiarRol(rol: Rol): void {
    this.estudianteActual = { ...this.estudianteActual, rol: rol };
  }

  // Pasar a Premium: el backend devuelve un token nuevo con el rol actualizado (US-39)
  actualizarToken(token: string, rol: Rol): void {
    const almacen = localStorage.getItem(this.claveToken) != null ? localStorage : sessionStorage;
    this.cambiarRol(rol);

    almacen.setItem(this.claveToken, token);
    almacen.setItem(this.claveEstudiante, JSON.stringify(this.estudianteActual));
  }

  private leerEstudiante(): EstudianteSesion | null {
    const texto = localStorage.getItem(this.claveEstudiante) ?? sessionStorage.getItem(this.claveEstudiante);
    if (texto == null) {
      return null;
    }

    try {
      return JSON.parse(texto);
    } catch {
      this.borrarAlmacenamiento(); // dato dañado: se descarta la sesión
      return null;
    }
  }

  private borrarAlmacenamiento(): void {
    localStorage.removeItem(this.claveToken);
    localStorage.removeItem(this.claveEstudiante);
    sessionStorage.removeItem(this.claveToken);
    sessionStorage.removeItem(this.claveEstudiante);
  }
}
