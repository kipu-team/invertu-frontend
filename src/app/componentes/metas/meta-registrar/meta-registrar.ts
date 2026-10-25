import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

@Component({
  selector: 'app-meta-registrar',
  imports: [EnConstruccion],
  templateUrl: './meta-registrar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './meta-registrar.css',
})
export class MetaRegistrar {
  pendientes = [
    'Formulario reactivo: nombre, monto objetivo, fecha límite, frecuencia de aporte, descripción',
    'Con :id en la ruta → cargar la meta y editar (igual que registrar-pozo/:id del profe)',
    'Validaciones (68) y confirmaciones (69, 81)',
  ];
}
