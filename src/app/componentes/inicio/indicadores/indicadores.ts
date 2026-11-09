import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Indicadores } from '../../../modelo/inicio';

/**
 * US-07: tarjetas de indicadores del mes (Figura 22).
 * Ingresos y gastos (con su parte fija y variable), balance disponible y ahorro destinado a metas.
 *
 * Uso: <app-indicadores [indicadores]="indicadores" />
 */
@Component({
  selector: 'app-indicadores',
  imports: [TranslatePipe, DecimalPipe],
  templateUrl: './indicadores.html',
  styleUrl: './indicadores.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TarjetasIndicadores {
  indicadores = input.required<Indicadores>();

  /** % de la parte fija sobre el total (el resto es variable) */
  private porcentajeFijo(fijo: number, total: number): number {
    return total > 0 ? Math.round((fijo / total) * 100) : 0;
  }

  readonly ingresosFijoPct = computed(() =>
    this.porcentajeFijo(this.indicadores().ingresosFijos, this.indicadores().ingresos),
  );

  readonly gastosFijoPct = computed(() =>
    this.porcentajeFijo(this.indicadores().gastosFijos, this.indicadores().gastos),
  );

  /** Tasa de ahorro: cuánto de lo que ingresó en el mes se destinó a metas */
  readonly tasaAhorro = computed(() => {
    const i = this.indicadores();
    return i.ingresos > 0 ? (i.aportesMetas / i.ingresos) * 100 : 0;
  });

  /** % de la parte variable (0 si no hubo movimientos de ese tipo) */
  porcentajeVariable(fijoPct: number, total: number): number {
    return total > 0 ? 100 - fijoPct : 0;
  }

  readonly balancePositivo = computed(() => this.indicadores().disponible >= 0);
}
