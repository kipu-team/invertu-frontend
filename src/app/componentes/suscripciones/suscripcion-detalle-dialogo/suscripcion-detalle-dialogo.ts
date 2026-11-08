import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { SuscripcionService } from '../../../servicios/suscripcion-service';
import { SuscripcionDetalle } from '../../../modelo/suscripcion';

@Component({
  selector: 'app-suscripcion-detalle-dialogo',
  imports: [
    DatePipe,
    DecimalPipe,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatIconButton,
    MatIcon,
    MatSlideToggle,
    TranslatePipe,
  ],
  templateUrl: './suscripcion-detalle-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './suscripcion-detalle-dialogo.css',
})
export class SuscripcionDetalleDialogo implements OnInit {
  private suscripcionService = inject(SuscripcionService);
  private idSuscripcion = inject<number>(MAT_DIALOG_DATA);

  detalle = signal<SuscripcionDetalle | null>(null);

  ngOnInit(): void {
    this.suscripcionService
      .obtenerDetalle(this.idSuscripcion)
      .subscribe((data) => this.detalle.set(data));
  }
}
