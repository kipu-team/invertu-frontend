import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  inject,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MovimientoService } from '../../../servicios/movimiento-service';
import { MovimientoDetalle } from '../../../modelo/movimiento';

/** Panel de detalle de un movimiento */
@Component({
  selector: 'app-detalle-movimiento',
  imports: [DatePipe, DecimalPipe, TranslatePipe, MatButton, MatIconButton, MatIcon],
  templateUrl: './detalle-movimiento.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './detalle-movimiento.css',
})
export class DetalleMovimiento implements OnChanges {
  @Input() idMovimiento: number | null = null;
  @Output() volver = new EventEmitter<void>();
  @Output() editar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<number>();
  private movimientoService = inject(MovimientoService);

  detalle: MovimientoDetalle | null = null;

  ngOnChanges(): void {
    if (this.idMovimiento) {
      this.movimientoService
        .obtenerDetalle(this.idMovimiento)
        .subscribe((data) => (this.detalle = data));
    }
  }
}
