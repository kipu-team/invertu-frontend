import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AutenticacionService } from '../../../servicios/autenticacion-service';
import { PanelAutenticacion } from '../panel-autenticacion/panel-autenticacion';
import { RequisitosContrasena } from '../requisitos-contrasena/requisitos-contrasena';
import { PATRON_CONTRASENA, contrasenasCoinciden } from '../validadores-contrasena';

type Vista = 'validando' | 'formulario' | 'exito' | 'invalido';

const MENSAJE_ENLACE_INVALIDO = 'El enlace expiró o no es válido';

/**
 * US-04: restablecer contraseña (Figuras 11–13). Conectado con END-AUTH-04 y END-AUTH-05.
 * Se llega desde el enlace del correo: /restablecer-contrasena?token=...
 * 1) Valida el enlace (END-AUTH-04) antes de mostrar el formulario.
 * 2) Si es válido, pide la nueva contraseña y la guarda (END-AUTH-05).
 */
@Component({
  selector: 'app-restablecer-contrasena',
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
    MatProgressSpinner,
    PanelAutenticacion,
    RequisitosContrasena,
  ],
  templateUrl: './restablecer-contrasena.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['../autenticacion-comun.css', './restablecer-contrasena.css'],
})
export class RestablecerContrasena implements OnInit {
  private fb = inject(FormBuilder);
  private autenticacionService = inject(AutenticacionService);
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);

  vista: Vista = 'validando';
  cargando = false;
  mostrarContrasena = false;
  mostrarConfirmar = false;
  errorClave = '';
  private token = '';

  formulario = this.fb.group(
    {
      nuevaContrasena: ['', [Validators.required, Validators.pattern(PATRON_CONTRASENA), Validators.maxLength(72)]],
      confirmarContrasena: ['', Validators.required],
    },
    { validators: contrasenasCoinciden('nuevaContrasena', 'confirmarContrasena') },
  );

  get c() {
    return this.formulario.controls;
  }

  ngOnInit(): void {
    this.token = this.ruta.snapshot.queryParamMap.get('token') ?? '';

    // Seguridad: se quita el token de la barra de direcciones para que no quede en el historial
    this.router.navigate([], { relativeTo: this.ruta, queryParams: {}, replaceUrl: true });

    if (!this.token) {
      this.vista = 'invalido';
      return;
    }
    // END-AUTH-04: el token va en el cuerpo de la petición, no en la URL
    this.autenticacionService.validarToken({ token: this.token }).subscribe({
      next: () => (this.vista = 'formulario'),
      error: () => (this.vista = 'invalido'),
    });
  }

  restablecer(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.errorClave = '';
    const v = this.formulario.getRawValue();
    this.autenticacionService
      .restablecerContrasena({
        token: this.token,
        nuevaContrasena: v.nuevaContrasena!,
        confirmarContrasena: v.confirmarContrasena!,
      })
      .subscribe({
        next: () => {
          this.cargando = false;
          this.vista = 'exito';
        },
        error: (err: HttpErrorResponse) => {
          this.cargando = false;
          if (err.status === 400 && err.error?.error === MENSAJE_ENLACE_INVALIDO) {
            this.vista = 'invalido'; // venció mientras escribía, o ya se usó
          } else if (err.status === 400) {
            this.errorClave = 'autenticacion.restablecer.errores.noCumple';
          } else {
            this.errorClave = 'autenticacion.iniciarSesion.errores.servidor';
          }
        },
      });
  }
}
