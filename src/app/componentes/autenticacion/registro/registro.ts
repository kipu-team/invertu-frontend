import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AutenticacionService } from '../../../servicios/autenticacion-service';
import { RegistroRequest } from '../../../modelo/autenticacion';
import { PanelAutenticacion } from '../panel-autenticacion/panel-autenticacion';

/** Mismas reglas que RegistroRequestDTO del backend (END-AUTH-01) */
const PATRON_CORREO = /.+@.+\..+/;
const PATRON_CONTRASENA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

/** Validador del formulario: la confirmación debe ser igual a la contraseña */
function contrasenasCoinciden(grupo: AbstractControl): ValidationErrors | null {
  const contrasena = grupo.get('contrasena')?.value;
  const confirmar = grupo.get('confirmarContrasena');
  if (confirmar?.value && contrasena !== confirmar.value) {
    confirmar.setErrors({ ...confirmar.errors, noCoinciden: true });
  } else if (confirmar?.hasError('noCoinciden')) {
    const { noCoinciden, ...resto } = confirmar.errors ?? {};
    confirmar.setErrors(Object.keys(resto).length ? resto : null);
  }
  return null;
}

/**
 * US-01: registro de cuenta (Figuras 14–20). Conectado con END-AUTH-01.
 * Éxito (201) → /iniciar-sesion?registrado=1, donde se muestra "Tu cuenta fue creada...".
 */
@Component({
  selector: 'app-registro',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    RouterLink,
    MatFormField,
    MatInput,
    MatError,
    MatPrefix,
    MatSuffix,
    MatButton,
    MatIconButton,
    MatIcon,
    PanelAutenticacion,
  ],
  templateUrl: './registro.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['../autenticacion-comun.css', './registro.css'],
})
export class Registro {
  private fb = inject(FormBuilder);
  private autenticacionService = inject(AutenticacionService);
  private router = inject(Router);

  cargando = false;
  mostrarContrasena = false;
  mostrarConfirmar = false;
  errorClave = ''; // clave i18n del error de la caja roja
  correoDuplicado = false; // 409: muestra además el enlace "Inicia sesión"

  formulario = this.fb.group(
    {
      nombres: ['', [Validators.required, Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.maxLength(100)]],
      correo: ['', [Validators.required, Validators.pattern(PATRON_CORREO), Validators.maxLength(150)]],
      contrasena: ['', [Validators.required, Validators.pattern(PATRON_CONTRASENA), Validators.maxLength(72)]],
      confirmarContrasena: ['', Validators.required],
    },
    { validators: contrasenasCoinciden },
  );

  get c() {
    return this.formulario.controls;
  }

  /** Lista de requisitos de la contraseña: en verde si se cumple, en gris si no (US-01) */
  get requisitos() {
    const v = this.c.contrasena.value ?? '';
    return [
      { clave: 'minimo', ok: v.length >= 8 },
      { clave: 'mayuscula', ok: /[A-Z]/.test(v) },
      { clave: 'minuscula', ok: /[a-z]/.test(v) },
      { clave: 'numero', ok: /\d/.test(v) },
      { clave: 'especial', ok: /[^A-Za-z0-9\s]/.test(v) },
    ];
  }

  /** "Este campo es obligatorio" también si solo escribió espacios */
  vacio(campo: 'nombres' | 'apellidos'): boolean {
    const control = this.c[campo];
    return control.hasError('required') || (control.touched && !(control.value ?? '').trim());
  }

  registrar(): void {
    const v = this.formulario.getRawValue();
    if (this.formulario.invalid || !v.nombres?.trim() || !v.apellidos?.trim()) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.errorClave = '';
    this.correoDuplicado = false;
    const datos: RegistroRequest = {
      nombres: v.nombres!.trim(),
      apellidos: v.apellidos!.trim(),
      correo: v.correo!.trim(),
      contrasena: v.contrasena!,
      confirmarContrasena: v.confirmarContrasena!,
    };
    this.autenticacionService.registrar(datos).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/iniciar-sesion'], { queryParams: { registrado: 1 } });
      },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;
        if (err.status === 409) {
          this.errorClave = 'autenticacion.registro.errores.correoRegistrado';
          this.correoDuplicado = true;
        } else if (err.status === 400) {
          this.errorClave = 'autenticacion.registro.errores.datosInvalidos';
        } else if (err.status === 429) {
          this.errorClave = 'autenticacion.registro.errores.demasiadosIntentos';
        } else {
          this.errorClave = 'autenticacion.iniciarSesion.errores.servidor';
        }
      },
    });
  }
}
