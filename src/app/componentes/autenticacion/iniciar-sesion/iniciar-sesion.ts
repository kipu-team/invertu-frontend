import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AutenticacionService } from '../../../servicios/autenticacion-service';
import { AuthRequest, AuthResponse } from '../../../modelo/autenticacion';
import { PanelAutenticacion } from '../panel-autenticacion/panel-autenticacion';

/*
 * Inicio de sesión (US-02) | END-AUTH-02: POST /autenticacion/iniciar-sesion
 */
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
  styleUrls: ['../autenticacion-comun.css', './iniciar-sesion.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class IniciarSesion implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  fb: FormBuilder = inject(FormBuilder);
  autenticacionService: AutenticacionService = inject(AutenticacionService);

  formulario: FormGroup;

  cargando: boolean = false;
  mostrarContrasena: boolean = false;
  cuentaCreada: boolean = false;
  errorClave: string = ''; // clave i18n del mensaje de error

  // Formulario: correo y contraseña obligatorios (E3)
  constructor() {
    this.formulario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      recuerdame: [false],
    });
  }

  // Llegada desde el registro: "Tu cuenta fue creada" (US-01 E1)
  ngOnInit(): void {
    this.cuentaCreada = this.route.snapshot.queryParamMap.has('registrado');
  }

  onSubmit(): void {
    if (this.formulario.valid) {

      const authRequest: AuthRequest = {
        correo: this.formulario.value.correo,
        contrasena: this.formulario.value.contrasena,
      };
      const recordar: boolean = this.formulario.value.recuerdame;

      this.cargando = true;
      this.errorClave = '';

      this.autenticacionService.iniciarSesion(authRequest, recordar).subscribe({
        next: (data: AuthResponse): void => {
          console.log('Login exitoso');
          this.cargando = false;
          this.router.navigate(['/inicio']); // E1: 200 OK
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error en login:', error.status);
          this.cargando = false;

          switch (error.status) {
            case 401: // E2: credenciales incorrectas
              this.errorClave = 'autenticacion.iniciarSesion.errores.credenciales';
              break;
            case 429: // bloqueo de 15 min tras 5 intentos
              this.errorClave = 'autenticacion.iniciarSesion.errores.demasiadosIntentos';
              break;
            default:
              this.errorClave = 'autenticacion.iniciarSesion.errores.servidor';
          }
        },
      });

    } else {
      this.formulario.markAllAsTouched(); // E3: mensajes en los campos, sin llamar al backend
    }
  }
}
