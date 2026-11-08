import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { SuscripcionService } from '../../../servicios/suscripcion-service';
import { SuscripcionDetalle } from '../../../modelo/suscripcion';
import { SesionService } from '../../../servicios/sesion-service';
import { AvisoPremiumDialogo } from '../../premium/aviso-premium-dialogo/aviso-premium-dialogo';

/**
 * Detalle de una suscripción con su historial de pagos (Figura 53). Responsable: Luz. US-27.
 * US-31: activar el recordatorio y elegir los días de anticipación.
 */
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
  private dialog = inject(MatDialog);
  sesion = inject(SesionService);

  detalle = signal<SuscripcionDetalle | null>(null);

  // US-31: días de anticipación que acepta el backend
  readonly opcionesDias = [1, 3, 7];
  private readonly limiteFree = 3;

  ngOnInit(): void {
    this.suscripcionService
      .obtenerDetalle(this.idSuscripcion)
      .subscribe((data) => this.detalle.set(data));
  }

  // US-31: activar o desactivar el recordatorio por correo (Figura 53)
  cambiarRecordatorio(evento: MatSlideToggleChange): void {
    const s = this.detalle()!;
    if (!evento.checked) {
      this.guardarRecordatorio(false, null);
      return;
    }
    // Plan Free: máximo 3 recordatorios activos (la misma regla del backend)
    if (this.sesion.esPremium()) {
      this.guardarRecordatorio(true, s.diasAnticipacion ?? 1);
      return;
    }
    this.suscripcionService.listar('ACTIVA').subscribe((lista) => {
      const activos = lista.filter(
        (x) => x.recordatorioActivo && x.idSuscripcion !== s.idSuscripcion,
      ).length;
      if (activos >= this.limiteFree) {
        evento.source.checked = false; // el interruptor vuelve a apagarse
        this.dialog.open(AvisoPremiumDialogo, {
          data: { mensaje: 'suscripciones.recordatorio.limite' },
          maxWidth: '95vw',
        });
      } else {
        this.guardarRecordatorio(true, s.diasAnticipacion ?? 1);
      }
    });
  }

  // US-31: cambiar los días de anticipación (1, 3 o 7)
  cambiarDias(dias: number): void {
    this.guardarRecordatorio(true, dias);
  }

  private guardarRecordatorio(activo: boolean, dias: number | null): void {
    this.suscripcionService
      .configurarRecordatorio(this.idSuscripcion, { activo, diasAnticipacion: dias })
      .subscribe((r) =>
        this.detalle.update((s) => ({
          ...s!,
          recordatorioActivo: r.recordatorioActivo,
          diasAnticipacion: r.diasAnticipacion,
        })),
      );
  }
}
