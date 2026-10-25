import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

@Component({
  selector: 'app-registro',
  imports: [EnConstruccion],
  templateUrl: './registro.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './registro.css',
})
export class Registro {
  pendientes = [
    'Formulario: nombres, apellidos, correo, contraseña y confirmar contraseña',
    'Errores: campo obligatorio, contraseñas no coinciden, correo ya registrado (409)',
    'Éxito → /iniciar-sesion con el mensaje de cuenta creada (Figura 16)',
    'Prueba: sofia@correo.com devuelve 409 (correo ya registrado)',
  ];
}
