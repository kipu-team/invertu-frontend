import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Devuelve la fecha elegida (AAAA-MM-DD) o nada si el usuario cancela.
 */
@Component({
  selector: 'app-reactivar-dialogo',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './reactivar-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './reactivar-dialogo.css',
})
export class ReactivarDialogo {
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<ReactivarDialogo, string>>(MatDialogRef);
  nombreServicio = inject<string>(MAT_DIALOG_DATA);

  hoy = new Date().toLocaleDateString('en-CA');

  // Igual que el backend: obligatoria y no anterior a hoy
  fecha = this.fb.control('', [
    Validators.required,
    (control: AbstractControl) =>
      control.value && control.value < this.hoy ? { fechaPasada: true } : null,
  ]);

  reactivar(): void {
    if (this.fecha.invalid) {
      this.fecha.markAsTouched();
      return;
    }
    this.dialogRef.close(this.fecha.value!);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
