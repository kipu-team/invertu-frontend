import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

@Component({
  selector: 'app-movimientos',
  imports: [EnConstruccion],
  templateUrl: './movimientos.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './movimientos.css',
})
export class Movimientos {
  pendientes = [
    'Tabla del historial (mat-table) con selector de mes, búsqueda y filtros (24, 44); estados vacíos (32, 43)',
    'Panel lateral: elegir método (25), registro manual (29–31, 33–34), registro con IA Premium (26–27, 46)',
    'Panel lateral: detalle (35) y edición (28, 36–38); eliminar con ConfirmarDialogo (45)',
    'Chips de categoría: usar <app-selector-categorias [(seleccionada)]="..." /> (lo hace Matias)',
  ];
}
