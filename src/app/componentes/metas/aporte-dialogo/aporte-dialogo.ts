import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MetaDetalle } from '../../../modelo/meta';
import { Aporte, AporteRequest } from '../../../modelo/aporte';
import { AporteService } from '../../../servicios/aporte-service';
import { InicioService } from '../../../servicios/inicio-service';
import { ConfirmarDialogo } from '../../compartidos/confirmar-dialogo/confirmar-dialogo';

@Component({
  selector: 'app-aporte-dialogo',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    TranslatePipe,
    DecimalPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './aporte-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './aporte-dialogo.css',
})
export class AporteDialogo {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private dialogRef = inject<MatDialogRef<AporteDialogo, Aporte>>(MatDialogRef);
  private aporteService = inject(AporteService);
  private inicioService = inject(InicioService);
  meta = inject<MetaDetalle>(MAT_DIALOG_DATA);

  hoy = new Date().toLocaleDateString('en-CA');

  formulario = this.fb.group({
    monto: [
      null as number | null,
      [Validators.required, Validators.min(0.01), Validators.max(this.restante)],
    ],
    fecha: [
      this.hoy,
      [
        Validators.required,
        (control: AbstractControl) => (control.value > this.hoy ? { fechaFutura: true } : null),
      ],
    ],
    descripcion: [''],
  });

  get monto() {
    return this.formulario.controls.monto;
  }

  get fecha() {
    return this.formulario.controls.fecha;
  }

  get restante(): number {
    return Math.max(this.meta.montoObjetivo - this.meta.montoAportado, 0);
  }

  registrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const monto = this.formulario.getRawValue().monto ?? 0;
    const hoy = new Date();
    this.inicioService.obtenerIndicadores(hoy.getFullYear(), hoy.getMonth() + 1).subscribe({
      next: (indicadores) => {
        if (monto > indicadores.disponible) {
          this.confirmarExceso();
        } else {
          this.guardar();
        }
      },
    });
  }

  private confirmarExceso(): void {
    this.dialog
      .open(ConfirmarDialogo, {
        data: {
          titulo: 'metas.aporte.excedeTitulo',
          mensaje: 'metas.aporte.excede',
          textoConfirmar: 'metas.aporte.continuar',
        },
      })
      .afterClosed()
      .subscribe((continuar) => {
        if (continuar) this.guardar();
      });
  }

  private guardar(): void {
    const v = this.formulario.getRawValue();
    const datos: AporteRequest = {
      monto: v.monto ?? 0,
      fecha: v.fecha ?? '',
      descripcion: v.descripcion || undefined,
    };
    this.aporteService.registrar(this.meta.idMeta, datos).subscribe({
      next: (aporte) => this.dialogRef.close(aporte),
    });
  }
}
