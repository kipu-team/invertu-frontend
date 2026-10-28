import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

function fechaPosteriorAHoy(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;
  const hoy = new Date().toLocaleDateString('en-CA');
  return valor > hoy ? null : { fechaPasada: true };
}
@Component({
  selector: 'app-meta-registrar',
  imports: [ReactiveFormsModule, TranslatePipe, MatButton, MatIcon],
  templateUrl: './meta-registrar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './meta-registrar.css',
})
export class MetaRegistrar {
  private fb = inject(FormBuilder);

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
}
