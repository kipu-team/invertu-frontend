import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Graficos } from '../../../modelo/inicio';

/** Colores de las categorías (en orden: la de mayor monto toma el primero) */
const COLORES = [
  'var(--verde-esmeralda)',
  'var(--dorado)',
  '#3b82f6',
  'var(--verde-oscuro)',
  '#a855f7',
  '#ef7d57',
  '#14b8a6',
  '#94a3b8',
];

/**
 * US-08: gráficos del mes (Figura 22). Hechos con SVG, sin librerías extra.
 * - Ingresos vs gastos por semana (líneas)
 * - Gastos por categoría (dona)
 * - Ingresos por fuente (barras)
 *
 * Uso: <app-graficos [graficos]="graficos" />
 */
@Component({
  selector: 'app-graficos',
  imports: [TranslatePipe, DecimalPipe],
  templateUrl: './graficos.html',
  styleUrl: './graficos.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class GraficosMes {
  graficos = input.required<Graficos>();

  // ---------- Líneas: medidas del dibujo (viewBox 0 0 600 200) ----------
  readonly ancho = 600;
  readonly alto = 200;
  private readonly margen = 24;

  private readonly maximoSemanal = computed(() =>
    Math.max(1, ...this.graficos().evolucionSemanal.flatMap((s) => [s.ingresos, s.gastos])),
  );

  /** Posición (x, y) de cada semana para ingresos y gastos */
  readonly puntos = computed(() => {
    const semanas = this.graficos().evolucionSemanal;
    const paso = (this.ancho - this.margen * 2) / Math.max(1, semanas.length - 1);
    const y = (valor: number) =>
      this.alto - this.margen - (valor / this.maximoSemanal()) * (this.alto - this.margen * 2);
    return semanas.map((s, i) => ({
      semana: s.semana,
      x: this.margen + paso * i,
      yIngresos: y(s.ingresos),
      yGastos: y(s.gastos),
    }));
  });

  readonly lineaIngresos = computed(() =>
    this.puntos()
      .map((p) => `${p.x},${p.yIngresos}`)
      .join(' '),
  );

  readonly lineaGastos = computed(() =>
    this.puntos()
      .map((p) => `${p.x},${p.yGastos}`)
      .join(' '),
  );

  /** 3 líneas guía horizontales */
  readonly guias = [0.25, 0.5, 0.75].map((f) => this.margen + f * (this.alto - this.margen * 2));

  // ---------- Dona de gastos por categoría ----------
  readonly radio = 15.9155; // circunferencia = 100, así cada % es un trazo directo

  readonly totalGastos = computed(() =>
    this.graficos().gastosPorCategoria.reduce((t, c) => t + c.total, 0),
  );

  readonly segmentosDona = computed(() => {
    let acumulado = 0;
    return this.graficos().gastosPorCategoria.map((c, i) => {
      const pct = this.totalGastos() > 0 ? (c.total / this.totalGastos()) * 100 : 0;
      const segmento = {
        categoria: c.categoria,
        total: c.total,
        color: COLORES[i % COLORES.length],
        trazo: `${pct} ${100 - pct}`,
        desfase: 25 - acumulado, // empieza arriba (las 12 en punto)
      };
      acumulado += pct;
      return segmento;
    });
  });

  // ---------- Barras de ingresos por fuente ----------
  readonly fuentes = computed(() => {
    const total = this.graficos().ingresosPorFuente.reduce((t, c) => t + c.total, 0);
    return this.graficos().ingresosPorFuente.map((c, i) => ({
      categoria: c.categoria,
      total: c.total,
      pct: total > 0 ? Math.round((c.total / total) * 100) : 0,
      color: COLORES[i % COLORES.length],
    }));
  });
}
