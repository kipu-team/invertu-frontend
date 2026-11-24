import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AutenticacionService } from '../../../servicios/autenticacion-service';
import { Mensaje } from '../../../modelo/comun';
import { RecuperarContrasenaRequest } from '../../../modelo/autenticacion';
import { PanelAutenticacion } from '../panel-autenticacion/panel-autenticacion';

/*
 * Solicitar enlace de recuperación (US-03) | END-AUTH-03: POST /autenticacion/recuperar-contrasena
 * Vistas: formulario y "Enlace enviado" con contador de 1 minuto
 */
@Component({
  selector: 'app-recuperar-contrasena',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    RouterLink,
    MatFormField,
    MatInput,
    MatError,
    MatPrefix,
    MatButton,
    MatIcon,
    PanelAutenticacion,
  ],
  templateUrl: './recuperar-contrasena.html',
  styleUrls: ['../autenticacion-comun.css', './recuperar-contrasena.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RecuperarContrasena implements OnDestroy {
  fb: FormBuilder = inject(FormBuilder);
  autenticacionService: AutenticacionService = inject(AutenticacionService);

  formulario: FormGroup;

  cargando: boolean = false;
  enviado: boolean = false; // false: formulario | true: "Enlace enviado"
  errorClave: string = '';

  segundosRestantes: number = 0;
  temporizador: any;

  constructor() {
    this.formulario = this.fb.group({
      correo: ['', [Validators.required, Validators.pattern(/.+@.+\..+/)]],
    });
  }

  // Salida de la pantalla: detención del contador
  ngOnDestroy(): void {
    clearInterval(this.temporizador);
  }

  // "Enviar enlace" y "Reenviar enlace": mismo endpoint (E1, E2 y E3)
  onSubmit(): void {
    if (this.formulario.valid) {

      const recuperarRequest: RecuperarContrasenaRequest = {
        correo: this.formulario.value.correo.trim(),
      };

      this.cargando = true;
      this.errorClave = '';

      this.autenticacionService.recuperarContrasena(recuperarRequest).subscribe({
        next: (data: Mensaje): void => {
          console.log('Enlace de recuperación solicitado');
          this.cargando = false;
          this.enviado = true; // 200 OK, exista o no el correo
          this.iniciarContador();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al solicitar el enlace:', error.status);
          this.cargando = false;

          switch (error.status) {
            case 429: // reenvío antes de 1 minuto
              this.errorClave = 'autenticacion.recuperar.errores.esperar';
              break;
            case 400:
              this.errorClave = 'autenticacion.iniciarSesion.errores.correoInvalido';
              break;
            default:
              this.errorClave = 'autenticacion.iniciarSesion.errores.servidor';
          }
        },
      });

    } else {
      this.formulario.markAllAsTouched();
    }
  }

  // Regreso al formulario para usar otro correo
  cambiarCorreo(): void {
    clearInterval(this.temporizador);
    this.enviado = false;
    this.errorClave = '';
  }

  // Contador en formato "0:45"
  tiempo(): string {
    const minutos: number = Math.floor(this.segundosRestantes / 60);
    const segundos: number = this.segundosRestantes % 60;
    return minutos + ':' + String(segundos).padStart(2, '0');
  }

  // Contador de 1 minuto para habilitar "Reenviar enlace"
  iniciarContador(): void {
    clearInterval(this.temporizador);
    this.segundosRestantes = 60;

    this.temporizador = setInterval(() => {
      this.segundosRestantes--;
      if (this.segundosRestantes <= 0) {
        clearInterval(this.temporizador);
      }
    }, 1000);
  }
}
