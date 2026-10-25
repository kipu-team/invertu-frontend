import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

@Component({
  selector: 'app-suscripciones',
  imports: [EnConstruccion],
  templateUrl: './suscripciones.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './suscripciones.css',
})
export class Suscripciones {
  pendientes = [
    'Listado de tarjetas + formulario lateral de registro/edición (47–51, 57, 59)',
    'Detalle con historial de pagos, "Pago sin registrar", recordatorio y alerta de saldo (52–55, 63–65)',
    'Cancelar y reactivar (58, 60–62); estado vacío (56)',
  ];
}
