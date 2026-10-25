import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

@Component({
  selector: 'app-iniciar-sesion',
  imports: [EnConstruccion],
  templateUrl: './iniciar-sesion.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './iniciar-sesion.css',
})
export class IniciarSesion {
  pendientes = [
    'Formulario reactivo (correo, contraseña) con validaciones',
    'Error 401 → mensaje de credenciales incorrectas (Figura 8)',
    'Enlaces a /registro y /recuperar-contrasena',
    'Al entrar correctamente: navegar a /inicio (guardar el token se verá con seguridad)',
    'Usuario de prueba: sofia@correo.com / Clave123*',
  ];
}
