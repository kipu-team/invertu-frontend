import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './cambiar-contrasena.html',
  styleUrl: './cambiar-contrasena.css',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class CambiarContrasenaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  formulario!: FormGroup;
  guardando = false;
  mensajeError = '';

  ocultarActual = true;
  ocultarNueva = true;
  ocultarConfirmar = true;

  ngOnInit(): void {
    this.formulario = this.fb.group({
      contrasenaActual: ['', [Validators.required]],
      nuevaContrasena: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[A-Z])/),
        Validators.pattern(/(?=.*\d)/),
        Validators.pattern(/(?=.*[@$!%*?&.#])/)
      ]],
      confirmarContrasena: ['', [Validators.required]]
    }, { validators: this.validarCoincidencia });
  }

  private validarCoincidencia(control: AbstractControl): ValidationErrors | null {
    const nueva = control.get('nuevaContrasena')?.value;
    const confirmar = control.get('confirmarContrasena')?.value;
    return nueva === confirmar ? null : { noCoincide: true };
  }

  get campoNueva() { return this.formulario.get('nuevaContrasena'); }
  get campoConfirmar() { return this.formulario.get('confirmarContrasena'); }

  cumpleMinimo(): boolean { return !this.campoNueva?.hasError('minlength') && !!this.campoNueva?.value; }
  cumpleMayuscula(): boolean { return this.campoNueva?.value && /(?=.*[A-Z])/.test(this.campoNueva.value); }
  cumpleNumero(): boolean { return this.campoNueva?.value && /(?=.*\d)/.test(this.campoNueva.value); }
  cumpleEspecial(): boolean { return this.campoNueva?.value && /(?=.*[@$!%*?&.#])/.test(this.campoNueva.value); }

  guardar(): void {
    if (this.formulario.invalid) return;
    this.guardando = true;
    this.mensajeError = '';

    setTimeout(() => {
      this.guardando = false;
      void this.router.navigate(['/perfil']);
    }, 1000);
  }
}
