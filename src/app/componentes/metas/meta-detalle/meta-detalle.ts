import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

@Component({
  selector: 'app-meta-detalle',
  imports: [EnConstruccion],
  templateUrl: './meta-detalle.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './meta-detalle.css',
})
export class MetaDetalle {
  pendientes = [
    'Detalle con progreso, historial de aportes y proyección (Premium; Free → bloqueada, 75)',
    'Registrar aporte (77–79)',
    'Meta vencida: extender fecha (82–84) o cancelar (85–86); eliminar (87)',
  ];
}
