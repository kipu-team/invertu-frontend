import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

function fechaPosteriorAHoy(control: AbstractControl): ValidationErrors | null {
  const hoy = new Date().toLocaleDateString('en-CA');
  return control.value > hoy ? null : { fechaPasada: true };
}

function fechaManana(): string {
  const dia = new Date();
  dia.setDate(dia.getDate() + 1);
  return dia.toLocaleDateString('en-CA');
}

@Component({
  selector: 'app-extender-fecha-dialogo',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogClose,
    MatButton,
    TranslatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './extender-fecha-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './extender-fecha-dialogo.css',
})
export class ExtenderFechaDialogo {
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<ExtenderFechaDialogo, string>>(MatDialogRef);

  manana = fechaManana();

  formulario = this.fb.group({
    fecha: ['', [fechaPosteriorAHoy]],
  });

  get fecha() {
    return this.formulario.controls.fecha;
  }

  confirmar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.fecha.value ?? '');
  }
}
