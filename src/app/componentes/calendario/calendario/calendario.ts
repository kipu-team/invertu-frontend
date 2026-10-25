import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

@Component({
  selector: 'app-calendario',
  imports: [EnConstruccion],
  templateUrl: './calendario.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './calendario.css',
})
export class Calendario {
  pendientes = [
    'Free → pantalla de bloqueo con botón a /pasar-premium (92), SIN llamar a la API',
    'Premium → vista mensual con eventos por color (89) y panel lateral del día (88, 91); estado vacío (90)',
  ];
}
