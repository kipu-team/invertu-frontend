import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AutenticacionService } from '../../../servicios/autenticacion-service';
import { SesionService } from '../../../servicios/sesion-service';
import { AuthRequest } from '../../../modelo/autenticacion';
import { PanelAutenticacion } from '../panel-autenticacion/panel-autenticacion';

@Component({
  selector: 'app-iniciar-sesion',
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
    MatCheckbox,
    PanelAutenticacion,
  ],
  templateUrl: './iniciar-sesion.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './iniciar-sesion.css',
})
export class IniciarSesion {
  private fb = inject(FormBuilder);
  private autenticacionService = inject(AutenticacionService);
  private router = inject(Router);
  private sesion = inject(SesionService);

  cargando = false;
  mostrarContrasena = false;
  errorClave = ''; // clave i18n del error que se muestra en la caja roja

  formulario = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
    recuerdame: [false],
  });
  get correo() {
    return this.formulario.controls.correo;
  }
  get contrasena() {
    return this.formulario.controls.contrasena;
  }

  iniciarSesion(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.errorClave = '';
    const v = this.formulario.getRawValue();
    const datos: AuthRequest = {
      correo: v.correo ?? '',
      contrasena: v.contrasena ?? '',
    };
    this.autenticacionService.iniciarSesion(datos).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.sesion.guardarSesion(respuesta, v.recuerdame ?? false);
        this.router.navigate(['/inicio']);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;
        this.errorClave =
          err.status === 401
            ? 'autenticacion.iniciarSesion.errores.credenciales'
            : 'autenticacion.iniciarSesion.errores.servidor';
      },
    });
  }
}
