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
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

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
  private snack = inject(MatSnackBar);
  private traductor = inject(TranslateService);
  detalle: MovimientoDetalle | null = null;

  ngOnChanges(): void {
    if (this.idMovimiento) {
      this.movimientoService.obtenerDetalle(this.idMovimiento).subscribe({
        next: (data) => (this.detalle = data),
        error: (err: HttpErrorResponse) => {
          this.detalle = null;
          const clave =
            err.status === 404
              ? 'movimientos.errores.noEncontrado'
              : 'movimientos.errores.servidor';
          this.snack.open(this.traductor.instant(clave), undefined, { duration: 5000 });
          this.volver.emit();
        },
      });
    }
  }
}
