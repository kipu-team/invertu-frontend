import { Idioma, Rol, Tema } from './comun';

/** POST /autenticacion/iniciar-sesion */
export interface AuthRequest {
  correo: string;
  contrasena: string;
}

export interface EstudianteSesion {
  idEstudiante: number;
  nombres: string;
  rol: Rol;
  tema: Tema;
  idioma: Idioma;
}

export interface AuthResponse {
  token: string;
  tipo: string; // "Bearer"
  expiraEn: number; // segundos
  estudiante: EstudianteSesion;
}

/** POST /autenticacion/registro */
export interface RegistroRequest {
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
}

export interface RegistroResponse {
  idEstudiante: number;
  nombres: string;
  correo: string;
  rol: Rol;
}

/** POST /autenticacion/recuperar-contrasena */
export interface RecuperarContrasenaRequest {
  correo: string;
}

/** POST /autenticacion/restablecer-contrasena/validar */
export interface ValidarTokenRequest {
  token: string;
}

export interface ValidarTokenResponse {
  valido: boolean;
  mensaje: string;
}

/** POST /autenticacion/restablecer-contrasena */
export interface RestablecerContrasenaRequest {
  token: string;
  nuevaContrasena: string;
  confirmarContrasena: string;
}
