import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

@Component({
  selector: 'app-pasar-premium',
  imports: [EnConstruccion],
  templateUrl: './pasar-premium.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pasar-premium.css',
})
export class PasarPremium {
  pendientes = [
    'Beneficios del plan y botón de prueba gratuita → perfilService.pasarPremium()',
    'Después: sesion.cambiarRol(respuesta.rol) y volver a /inicio',
  ];
}
