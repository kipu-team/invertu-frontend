import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/** 16 dígitos (se aceptan espacios entre grupos) */
function numeroTarjeta(control: AbstractControl): ValidationErrors | null {
  const digitos = String(control.value ?? '').replace(/\s/g, '');
  return /^\d{16}$/.test(digitos) ? null : { numero: true };
}

/** MM/AA con un mes válido y que no esté vencida (vale hasta el último día de ese mes) */
function vencimiento(control: AbstractControl): ValidationErrors | null {
  const partes = /^(\d{2})\/(\d{2})$/.exec(String(control.value ?? ''));
  if (!partes) return { formato: true };
  const mes = Number(partes[1]);
  const anio = 2000 + Number(partes[2]);
  if (mes < 1 || mes > 12) return { formato: true };
  const hoy = new Date();
  const vencida =
    anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1);
  return vencida ? { vencida: true } : null;
}

/**
 * T-144: pago simulado para pasar a Premium (Figura 98). Responsable: Luz.
 * Los datos de la tarjeta solo se validan aquí: NO se guardan ni se envían al backend.
 * Si todo está bien, se cierra con true y la pantalla Pasar a Premium llama a /pasar-premium.
 */
@Component({
  selector: 'app-pago-simulado-dialogo',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './pago-simulado-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pago-simulado-dialogo.css',
})
export class PagoSimuladoDialogo {
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<PagoSimuladoDialogo, boolean>>(MatDialogRef);

  formulario = this.fb.group({
    titular: ['', [Validators.required, Validators.maxLength(60)]],
    numero: ['', numeroTarjeta],
    vencimiento: ['', vencimiento],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
  });

  tieneError(campo: string): boolean {
    const control = this.formulario.get(campo)!;
    return control.invalid && control.touched;
  }

  // Mientras escribe: solo números, en grupos de 4 (1234 5678 ...)
  formatearNumero(evento: Event): void {
    const digitos = (evento.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 16);
    this.formulario.controls.numero.setValue(digitos.replace(/(\d{4})(?=\d)/g, '$1 '));
  }

  // Mientras escribe: MM/AA
  formatearVencimiento(evento: Event): void {
    const digitos = (evento.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);
    this.formulario.controls.vencimiento.setValue(
      digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos,
    );
  }

  formatearCvv(evento: Event): void {
    const digitos = (evento.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 3);
    this.formulario.controls.cvv.setValue(digitos);
  }

  pagar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.formulario.reset(); // los datos de la tarjeta no se guardan
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
