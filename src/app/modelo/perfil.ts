import { Idioma, Rol, Tema } from './comun';

/** GET /perfil */
export interface Perfil {
  nombres: string;
  apellidos: string;
  correo: string;
  universidad: string | null;
  tema: Tema;
  idioma: Idioma;
  rol: Rol;
  plan: {
    precioMensual: number;
    maxMetasActivas: number | null;
    maxRecordatorios: number | null;
  };
}

/** PUT /perfil */
export interface PerfilRequest {
  nombres: string;
  apellidos: string;
  universidad?: string;
}

/** PUT /perfil/preferencias */
export interface Preferencias {
  tema: Tema;
  idioma: Idioma;
}

/** PUT /perfil/contrasena */
export interface CambiarContrasenaRequest {
  contrasenaActual: string;
  nuevaContrasena: string;
  confirmarContrasena: string;
}

/** POST /perfil/pasar-premium (devuelve un token nuevo con el rol Premium) */
export interface PasarPremiumResponse {
  rol: Rol;
  token: string;
  mensaje: string;
}
