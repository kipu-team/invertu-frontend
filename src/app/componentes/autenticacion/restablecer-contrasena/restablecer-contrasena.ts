import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

@Component({
  selector: 'app-restablecer-contrasena',
  imports: [EnConstruccion],
  templateUrl: './restablecer-contrasena.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './restablecer-contrasena.css',
})
export class RestablecerContrasena {
  pendientes = [
    'Leer ?token= de la URL y validarlo al entrar',
    'Token inválido → Figura 13 (prueba: /restablecer-contrasena?token=expirado)',
    'Formulario de nueva contraseña → confirmación (Figura 12)',
  ];
}
