import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { ChatbotFlotante } from '../../chatbot/chatbot-flotante/chatbot-flotante';
import { OrientacionInicial } from '../orientacion/orientacion';
import { MesAnio, SelectorMes } from '../selector-mes/selector-mes';
import { TarjetasIndicadores } from '../indicadores/indicadores';
import { GraficosMes } from '../graficos/graficos';
import { InicioService } from '../../../servicios/inicio-service';
import { Graficos, Indicadores, Orientacion } from '../../../modelo/inicio';

@Component({
  selector: 'app-inicio',
  imports: [
    TranslatePipe,
    MatButton,
    MatIcon,
    ChatbotFlotante,
    OrientacionInicial,
    SelectorMes,
    TarjetasIndicadores,
    GraficosMes,
  ],
  templateUrl: './inicio.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private inicioService = inject(InicioService);

  orientacion: Orientacion | null = null;

  // US-06: mes consultado (empieza en el mes actual)
  periodo: MesAnio = this.mesActual();
  indicadores: Indicadores | null = null;
  graficos: Graficos | null = null;
  /** US-06 escenario 4: se pidió un mes futuro y el backend respondió 400 */
  errorMesFuturo = false;

  ngOnInit(): void {
    // US-05: el backend dice si se muestra la orientación (hasta tener un movimiento y una meta)
    this.inicioService.obtenerOrientacion().subscribe((data) => {
      this.orientacion = data;
    });
    this.cargarMes();
  }

  /** US-06: al elegir otro mes en el selector */
  alCambiarMes(periodo: MesAnio): void {
    this.periodo = periodo;
    this.cargarMes();
  }

  /** US-06: botón "Ver mes actual" del estado vacío */
  verMesActual(): void {
    this.alCambiarMes(this.mesActual());
  }

  /** US-06: sin movimientos ni aportes en el mes → estado vacío */
  get mesVacio(): boolean {
    const i = this.indicadores;
    return !!i && i.ingresos === 0 && i.gastos === 0 && i.aportesMetas === 0;
  }

  private mesActual(): MesAnio {
    const hoy = new Date();
    return { anio: hoy.getFullYear(), mes: hoy.getMonth() + 1 };
  }

  private cargarMes(): void {
    this.errorMesFuturo = false;
    this.inicioService.obtenerIndicadores(this.periodo.anio, this.periodo.mes).subscribe({
      next: (data) => {
        this.indicadores = data;
      },
      error: (err: HttpErrorResponse) => {
        // US-06 escenario 4: mes futuro → el backend responde 400; se vuelve al mes actual
        // (si ya era el mes actual no se reintenta, para no repetir la petición sin fin)
        const actual = this.mesActual();
        const yaEsActual = this.periodo.anio === actual.anio && this.periodo.mes === actual.mes;
        if (err.status === 400 && !yaEsActual) {
          this.periodo = actual;
          this.cargarMes();
          this.errorMesFuturo = true;
        }
      },
    });
    // US-08: gráficos del mismo mes (si es un mes futuro, el error ya se maneja arriba)
    this.inicioService.obtenerGraficos(this.periodo.anio, this.periodo.mes).subscribe({
      next: (data) => {
        this.graficos = data;
      },
      error: () => {
        this.graficos = null;
      },
    });
  }
}
