import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';
import { ChatbotFlotante } from '../../chatbot/chatbot-flotante/chatbot-flotante';
import { OrientacionInicial } from '../orientacion/orientacion';
import { MesAnio, SelectorMes } from '../selector-mes/selector-mes';
import { TarjetasIndicadores } from '../indicadores/indicadores';
import { InicioService } from '../../../servicios/inicio-service';
import { Indicadores, Orientacion } from '../../../modelo/inicio';

@Component({
  selector: 'app-inicio',
  imports: [
    TranslatePipe,
    RouterLink,
    MatButton,
    MatIcon,
    EnConstruccion,
    ChatbotFlotante,
    OrientacionInicial,
    SelectorMes,
    TarjetasIndicadores,
  ],
  templateUrl: './inicio.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private inicioService = inject(InicioService);

  orientacion: Orientacion | null = null;

  // US-06: mes consultado (empieza en el mes actual)
  periodo: MesAnio = { anio: new Date().getFullYear(), mes: new Date().getMonth() + 1 };
  indicadores: Indicadores | null = null;

  pendientes = [
    'Gráficos de ingresos y gastos (US-08, Figura 22)',
    'El chatbot ya está colocado abajo (<app-chatbot-flotante>): no lo muevas, lo hace Luz',
  ];

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

  /** Sin ingresos ni gastos en el mes → estado vacío */
  get mesVacio(): boolean {
    return !!this.indicadores && this.indicadores.ingresos === 0 && this.indicadores.gastos === 0;
  }

  private cargarMes(): void {
    this.inicioService
      .obtenerIndicadores(this.periodo.anio, this.periodo.mes)
      .subscribe((data) => {
        this.indicadores = data;
      });
  }
}
