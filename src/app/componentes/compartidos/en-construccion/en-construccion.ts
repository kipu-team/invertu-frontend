import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Cartel TEMPORAL para las pantallas que aún no se construyen.
 * Cuando termines tu pantalla, BORRA el <app-en-construccion> de tu HTML.
 */
@Component({
  selector: 'app-en-construccion',
  imports: [MatIcon, TranslatePipe],
  templateUrl: './en-construccion.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './en-construccion.css',
})
export class EnConstruccion {
  titulo = input.required<string>(); // clave de traducción
  responsable = input.required<string>();
  figuras = input.required<string>(); // figuras del informe (sección 3.2.1)
  pendientes = input<string[]>([]);
}
