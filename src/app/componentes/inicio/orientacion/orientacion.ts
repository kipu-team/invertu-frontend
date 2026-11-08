import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Orientacion } from '../../../modelo/inicio';

/**
 * US-05: orientación inicial (Figura 21).
 * Saludo y tarjetas de "primeros pasos". Inicio la muestra solo si orientacion.mostrarOrientacion
 * es true (el backend la oculta cuando el estudiante ya registró un movimiento y creó una meta).
 *
 * Uso: <app-orientacion [orientacion]="orientacion" />
 */
@Component({
  selector: 'app-orientacion',
  imports: [TranslatePipe, RouterLink, MatButton, MatIcon, MatProgressBar],
  templateUrl: './orientacion.html',
  styleUrl: './orientacion.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OrientacionInicial {
  orientacion = input.required<Orientacion>();

  /** Los 2 pasos: cada uno sabe si ya se cumplió y a qué pantalla lleva su botón. */
  pasos() {
    const o = this.orientacion();
    return [
      { clave: 'movimiento', hecho: o.movimientoRegistrado, ruta: '/movimientos' },
      { clave: 'meta', hecho: o.metaRegistrada, ruta: '/metas/registrar' },
    ];
  }
}
