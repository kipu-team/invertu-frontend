import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AutenticacionService } from '../../../servicios/autenticacion-service';
import { RestablecerContrasenaRequest, ValidarTokenRequest, ValidarTokenResponse } from '../../../modelo/autenticacion';
import { Mensaje } from '../../../modelo/comun';
import { PanelAutenticacion } from '../panel-autenticacion/panel-autenticacion';
import { RequisitosContrasena } from '../requisitos-contrasena/requisitos-contrasena';
import { PATRON_CONTRASENA, contrasenasCoinciden } from '../validadores-contrasena';

/*
 * Restablecer contraseña (US-04) | END-AUTH-04: validar enlace | END-AUTH-05: nueva contraseña
 * Acceso desde el correo: /restablecer-contrasena?token=...
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
  styleUrls: ['../autenticacion-comun.css', './restablecer-contrasena.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RestablecerContrasena implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  fb: FormBuilder = inject(FormBuilder);
  autenticacionService: AutenticacionService = inject(AutenticacionService);

  formulario: FormGroup;

  vista: string = 'validando'; // validando | formulario | exito | invalido
  cargando: boolean = false;
  mostrarContrasena: boolean = false;
  mostrarConfirmar: boolean = false;
  errorClave: string = '';
  token: string = '';

  constructor() {
    this.formulario = this.fb.group(
      {
        nuevaContrasena: ['', [Validators.required, Validators.pattern(PATRON_CONTRASENA), Validators.maxLength(72)]],
        confirmarContrasena: ['', Validators.required],
      },
      { validators: contrasenasCoinciden('nuevaContrasena', 'confirmarContrasena') },
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    // Token fuera de la barra de direcciones (no queda en el historial)
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });

    if (this.token) {
      this.validarEnlace();
    } else {
      this.vista = 'invalido';
    }
  }

  // END-AUTH-04: validación del enlace antes de mostrar el formulario
  validarEnlace(): void {
    const validarRequest: ValidarTokenRequest = { token: this.token };

    this.autenticacionService.validarToken(validarRequest).subscribe({
      next: (data: ValidarTokenResponse): void => {
        this.vista = 'formulario'; // 200 OK: enlace vigente
      },
      error: (error: HttpErrorResponse) => {
        console.error('Enlace no válido:', error.status);
        this.vista = 'invalido'; // E3: 400, enlace expirado o ya usado
      },
    });
  }

  onSubmit(): void {
    if (this.formulario.valid) {

      const restablecerRequest: RestablecerContrasenaRequest = {
        token: this.token,
        nuevaContrasena: this.formulario.value.nuevaContrasena,
        confirmarContrasena: this.formulario.value.confirmarContrasena,
      };

      this.cargando = true;
      this.errorClave = '';

      this.autenticacionService.restablecerContrasena(restablecerRequest).subscribe({
        next: (data: Mensaje): void => {
          console.log('Contraseña restablecida');
          this.cargando = false;
          this.vista = 'exito'; // E1: 200 OK
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al restablecer:', error.status);
          this.cargando = false;

          if (error.status === 400 && error.error?.error === 'El enlace expiró o no es válido') {
            this.vista = 'invalido'; // E3: venció mientras escribía
          } else if (error.status === 400) {
            this.errorClave = 'autenticacion.restablecer.errores.noCumple'; // E2
          } else {
            this.errorClave = 'autenticacion.iniciarSesion.errores.servidor';
          }
        },
      });

    } else {
      this.formulario.markAllAsTouched(); // E2: mensajes en los campos, sin llamar al backend
    }
  }
}
