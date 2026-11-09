import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';

export interface MesAnio {
  anio: number;
  mes: number; // 1 = enero ... 12 = diciembre
}

/**
 * US-06: selector de mes y año (Figura 22).
 * Igual que el backend, solo deja elegir el mes actual o meses anteriores (desde el año 2000).
 *
 * Uso: <app-selector-mes [valor]="{ anio, mes }" (cambio)="alCambiarMes($event)" />
 */
@Component({
  selector: 'app-selector-mes',
  imports: [TranslatePipe, MatButton, MatIconButton, MatIcon, MatMenu, MatMenuTrigger],
  templateUrl: './selector-mes.html',
  styleUrl: './selector-mes.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SelectorMes {
  valor = input.required<MesAnio>();
  cambio = output<MesAnio>();

  readonly meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  readonly anioMinimo = 2000;
  private readonly hoy = new Date();

  /** Año que se está viendo dentro del menú (puede ser distinto al elegido) */
  anioVisible = this.hoy.getFullYear();

  get anioActual(): number {
    return this.hoy.getFullYear();
  }

  abrir(): void {
    this.anioVisible = this.valor().anio;
  }

  cambiarAnio(delta: number): void {
    this.anioVisible += delta;
  }

  esFuturo(mes: number): boolean {
    return (
      this.anioVisible > this.anioActual ||
      (this.anioVisible === this.anioActual && mes > this.hoy.getMonth() + 1)
    );
  }

  esElegido(mes: number): boolean {
    return this.valor().anio === this.anioVisible && this.valor().mes === mes;
  }

  elegir(mes: number): void {
    this.cambio.emit({ anio: this.anioVisible, mes });
  }
}
