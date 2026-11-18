import { Component, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AutenticacionService } from '../../../servicios/autenticacion-service';
import { PanelAutenticacion } from '../panel-autenticacion/panel-autenticacion';

const SEGUNDOS_REENVIO = 60; // US-03: "Reenviar enlace" se habilita al terminar el contador de 1 minuto

/**
 * US-03: solicitar enlace de recuperación (Figuras 9 y 10). Conectado con END-AUTH-03.
 * Un solo componente con dos vistas: el formulario y "Enlace enviado" con el contador.
 * El backend responde igual exista o no el correo, para no revelar qué correos tienen cuenta.
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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['../autenticacion-comun.css', './recuperar-contrasena.css'],
})
export class RecuperarContrasena {
  private fb = inject(FormBuilder);
  private autenticacionService = inject(AutenticacionService);

  cargando = false;
  enviado = false; // false = formulario, true = vista "Enlace enviado"
  errorClave = '';
  segundosRestantes = 0;
  private temporizador?: ReturnType<typeof setInterval>;

  formulario = this.fb.group({
    correo: ['', [Validators.required, Validators.pattern(/.+@.+\..+/)]],
  });

  get correo() {
    return this.formulario.controls.correo;
  }

  /** "0:45" para el botón de reenviar */
  get tiempo(): string {
    const s = this.segundosRestantes;
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  constructor() {
    // Si sale de la pantalla, se detiene el contador
    inject(DestroyRef).onDestroy(() => clearInterval(this.temporizador));
  }

  /** Lo usan "Enviar enlace" y "Reenviar enlace": es el mismo endpoint (el reenvío invalida el enlace anterior) */
  enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.errorClave = '';
    const correo = this.correo.value!.trim();
    this.autenticacionService.recuperarContrasena({ correo }).subscribe({
      next: () => {
        this.cargando = false;
        this.enviado = true;
        this.iniciarContador();
      },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;
        if (err.status === 429) {
          this.errorClave = 'autenticacion.recuperar.errores.esperar';
        } else if (err.status === 400) {
          this.errorClave = 'autenticacion.iniciarSesion.errores.correoInvalido';
        } else {
          this.errorClave = 'autenticacion.iniciarSesion.errores.servidor';
        }
      },
    });
  }

  /** Volver al formulario para escribir otro correo */
  cambiarCorreo(): void {
    clearInterval(this.temporizador);
    this.enviado = false;
    this.errorClave = '';
  }

  private iniciarContador(): void {
    clearInterval(this.temporizador);
    this.segundosRestantes = SEGUNDOS_REENVIO;
    this.temporizador = setInterval(() => {
      this.segundosRestantes--;
      if (this.segundosRestantes <= 0) {
        clearInterval(this.temporizador);
      }
    }, 1000);
  }
}
