import { Component, ChangeDetectionStrategy, effect, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MetaService } from '../../../servicios/meta-service';
import { SesionService } from '../../../servicios/sesion-service';
import { MetaRequest } from '../../../modelo/meta';
import { FrecuenciaAporte } from '../../../modelo/comun';
import { MetaCreadaDialogo } from '../meta-creada-dialogo/meta-creada-dialogo';

function fechaPosteriorAHoy(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;
  const hoy = new Date().toLocaleDateString('en-CA');
  return valor > hoy ? null : { fechaPasada: true };
}
@Component({
  selector: 'app-meta-registrar',
  imports: [ReactiveFormsModule, TranslatePipe, MatButton, MatIcon, RouterLink],
  templateUrl: './meta-registrar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './meta-registrar.css',
})
export class MetaRegistrar {
  private fb = inject(FormBuilder);
  private metaService = inject(MetaService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private sesion = inject(SesionService);

  limiteAlcanzado = false;

  formulario = this.fb.group({
    nombre: ['', Validators.required],
    montoObjetivo: [null as number | null, [Validators.required, Validators.min(1)]],
    fechaObjetivo: ['', [Validators.required, fechaPosteriorAHoy]],
    frecuenciaAporte: ['SEMANAL', Validators.required],
    descripcion: [''],
  });
  get monto() {
    return this.formulario.controls.montoObjetivo;
  }
  get fecha() {
    return this.formulario.controls.fechaObjetivo;
  }

  constructor() {
    effect(() => {
      this.sesion.esPremium();
      this.metaService.consultarEstadoLimite().subscribe((estado) => {
        this.limiteAlcanzado = estado.limiteAlcanzado;
      });
    });
  }

  registrar(): void {
    if (this.formulario.invalid || this.limiteAlcanzado) {
      this.formulario.markAllAsTouched();
      return;
    }
    const v = this.formulario.getRawValue();
    const datos: MetaRequest = {
      nombre: v.nombre ?? '',
      montoObjetivo: v.montoObjetivo ?? 0,
      fechaObjetivo: v.fechaObjetivo ?? '',
      frecuenciaAporte: v.frecuenciaAporte as FrecuenciaAporte,
      descripcion: v.descripcion || undefined,
    };
    this.metaService.crear(datos).subscribe(() => {
      this.dialog
        .open(MetaCreadaDialogo, { disableClose: true })
        .afterClosed()
        .subscribe(() => this.router.navigate(['/metas']));
    });
  }

  cancelar(): void {
    this.router.navigate(['/metas']);
  }
}
