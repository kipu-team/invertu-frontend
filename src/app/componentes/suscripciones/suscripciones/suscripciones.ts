import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SuscripcionService } from '../../../servicios/suscripcion-service';
import { SuscripcionResumen } from '../../../modelo/suscripcion';
import { EstadoSuscripcion } from '../../../modelo/comun';

/** Filtro de la lista: todas, solo activas o solo canceladas */
type FiltroEstado = 'TODAS' | EstadoSuscripcion;

@Component({
  selector: 'app-suscripciones',
  imports: [DatePipe, DecimalPipe, MatButton, MatIcon, TranslatePipe],
  templateUrl: './suscripciones.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './suscripciones.css',
})

export class Suscripciones implements OnInit {
  private suscripcionService = inject(SuscripcionService);

  readonly filtros: FiltroEstado[] = ['TODAS', 'ACTIVA', 'CANCELADA'];

  suscripciones = signal<SuscripcionResumen[]>([]);
  filtro = signal<FiltroEstado>('TODAS');

  // Lo que se muestra según el filtro elegido
  suscripcionesFiltradas = computed(() =>
    this.suscripciones().filter((s) => this.filtro() === 'TODAS' || s.estado === this.filtro()),
  );

  // Números de las 3 tarjetas de resumen
  totalActivas = computed(() => this.suscripciones().filter((s) => s.estado === 'ACTIVA').length);
  totalCanceladas = computed(() => this.suscripciones().filter((s) => s.estado === 'CANCELADA').length);
  totalProximas = computed(
    () => this.suscripciones().filter((s) => s.estado === 'ACTIVA' && this.cobraPronto(s.proximaFechaCobro)).length,
  );

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.suscripcionService.listar().subscribe((data) => this.suscripciones.set(data));
  }

  // Próxima renovación = el cobro es dentro de los próximos 7 días
  private cobraPronto(fecha: string): boolean {
    const dias = (new Date(fecha + 'T00:00:00').getTime() - Date.now()) / 86_400_000;
    return dias >= -1 && dias <= 7;
  }
}
