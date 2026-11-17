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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  private route = inject(ActivatedRoute);

  limiteAlcanzado = false;
  idMeta: number | null = null;

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
  get editando() {
    return this.idMeta !== null;
  }

  constructor() {
    effect(() => {
      this.sesion.esPremium();
      this.metaService.consultarEstadoLimite().subscribe((estado) => {
        this.limiteAlcanzado = estado.limiteAlcanzado;
      });
    });
    this.route.params.subscribe((data) => {
      if (data['id']) {
        this.idMeta = +data['id'];
        this.cargarMeta(this.idMeta);
      }
    });
  }

  registrar(): void {
    if (this.formulario.invalid || (this.limiteAlcanzado && !this.editando)) {
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
    if (this.idMeta !== null) {
      this.metaService.actualizar(this.idMeta, datos).subscribe(() => {
        this.dialog
          .open(MetaCreadaDialogo, {
            disableClose: true,
            data: { mensaje: 'metas.editar.exito', boton: 'metas.editar.verDetalle' },
          })
          .afterClosed()
          .subscribe(() => this.router.navigate(['/metas', this.idMeta]));
      });
    } else {
      this.metaService.crear(datos).subscribe(() => {
        this.dialog
          .open(MetaCreadaDialogo, {
            disableClose: true,
            data: { mensaje: 'metas.registrar.exito', boton: 'metas.registrar.verMisMetas' },
          })
          .afterClosed()
          .subscribe(() => this.router.navigate(['/metas']));
      });
    }
  }

  cancelar(): void {
    this.router.navigate(this.editando ? ['/metas', this.idMeta] : ['/metas']);
  }

  private cargarMeta(id: number): void {
    this.metaService.obtenerDetalle(id).subscribe((meta) => {
      this.formulario.patchValue({
        nombre: meta.nombre,
        montoObjetivo: meta.montoObjetivo,
        fechaObjetivo: meta.fechaObjetivo,
        frecuenciaAporte: meta.frecuenciaAporte,
        descripcion: meta.descripcion ?? '',
      });
    });
  }
}
