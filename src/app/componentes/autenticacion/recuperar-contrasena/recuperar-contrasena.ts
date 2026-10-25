import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [EnConstruccion],
  templateUrl: './recuperar-contrasena.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './recuperar-contrasena.css',
})
export class RecuperarContrasena {
  pendientes = [
    'Campo correo → POST /recuperar-contrasena',
    'Después mostrar la vista "Enlace enviado" (mismo componente) con contador de 1 minuto para reenviar',
  ];
}
