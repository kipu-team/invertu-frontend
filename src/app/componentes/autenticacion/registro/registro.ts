import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AutenticacionService } from '../../../servicios/autenticacion-service';
import { RegistroRequest, RegistroResponse } from '../../../modelo/autenticacion';
import { PanelAutenticacion } from '../panel-autenticacion/panel-autenticacion';
import { RequisitosContrasena } from '../requisitos-contrasena/requisitos-contrasena';
import { PATRON_CONTRASENA, contrasenasCoinciden } from '../validadores-contrasena';

/*
 * Registro de cuenta (US-01) | END-AUTH-01: POST /autenticacion/registro
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
    RequisitosContrasena,
  ],
  templateUrl: './registro.html',
  styleUrls: ['../autenticacion-comun.css', './registro.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Registro {
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  autenticacionService: AutenticacionService = inject(AutenticacionService);

  formulario: FormGroup;

  cargando: boolean = false;
  mostrarContrasena: boolean = false;
  mostrarConfirmar: boolean = false;
  errorClave: string = '';
  correoDuplicado: boolean = false; // 409: muestra el enlace "Inicia sesión"

  // Formulario con las mismas reglas que RegistroRequestDTO (E3)
  constructor() {
    this.formulario = this.fb.group(
      {
        nombres: ['', [Validators.required, Validators.maxLength(100)]],
        apellidos: ['', [Validators.required, Validators.maxLength(100)]],
        correo: ['', [Validators.required, Validators.pattern(/.+@.+\..+/), Validators.maxLength(150)]],
        contrasena: ['', [Validators.required, Validators.pattern(PATRON_CONTRASENA), Validators.maxLength(72)]],
        confirmarContrasena: ['', Validators.required],
      },
      { validators: contrasenasCoinciden('contrasena', 'confirmarContrasena') },
    );
  }

  // Campo vacío o solo con espacios
  vacio(campo: string): boolean {
    const control = this.formulario.get(campo);
    return control != null && control.touched && !(control.value ?? '').trim();
  }

  onSubmit(): void {
    const nombres: string = this.formulario.value.nombres.trim();
    const apellidos: string = this.formulario.value.apellidos.trim();

    if (this.formulario.valid && nombres && apellidos) {

      const registroRequest: RegistroRequest = {
        nombres: nombres,
        apellidos: apellidos,
        correo: this.formulario.value.correo.trim(),
        contrasena: this.formulario.value.contrasena,
        confirmarContrasena: this.formulario.value.confirmarContrasena,
      };

      this.cargando = true;
      this.errorClave = '';
      this.correoDuplicado = false;

      this.autenticacionService.registrar(registroRequest).subscribe({
        next: (data: RegistroResponse): void => {
          console.log('Registro exitoso');
          this.cargando = false;
          // E1: 201 Created → login con el mensaje "Tu cuenta fue creada"
          this.router.navigate(['/iniciar-sesion'], { queryParams: { registrado: 1 } });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error en registro:', error.status);
          this.cargando = false;

          switch (error.status) {
            case 409: // E2: correo ya registrado
              this.errorClave = 'autenticacion.registro.errores.correoRegistrado';
              this.correoDuplicado = true;
              break;
            case 400: // E3: datos inválidos
              this.errorClave = 'autenticacion.registro.errores.datosInvalidos';
              break;
            case 429:
              this.errorClave = 'autenticacion.registro.errores.demasiadosIntentos';
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
