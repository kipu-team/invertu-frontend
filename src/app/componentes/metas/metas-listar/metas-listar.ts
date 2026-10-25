import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

@Component({
  selector: 'app-metas-listar',
  imports: [EnConstruccion],
  templateUrl: './metas-listar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './metas-listar.css',
})
export class MetasListar {
  pendientes = [
    'Pestañas Activas / Finalizadas (mat-tab-group) con tarjetas y barra de progreso',
    '"Nueva meta": consultar estado-limite; si limiteAlcanzado → aviso del plan Free (67)',
    'Estados vacíos (72–73)',
  ];
}
