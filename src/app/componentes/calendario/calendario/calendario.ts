import { Component, ChangeDetectionStrategy, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { SesionService } from '../../../servicios/sesion-service';
import { CalendarioPremiumDialogo } from '../calendario-premium-dialogo/calendario-premium-dialogo';
import { CalendarioService } from '../../../servicios/calendario-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDialogModule,
    TranslatePipe,
  ],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Calendario implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  public sesion = inject(SesionService);
  private calendarioService = inject(CalendarioService);

  filtroMetas = signal(true);
  filtroDeudas = signal(true);
  filtroSuscripciones = signal(true);

  fechaSistema = new Date();
  anioActual = signal<number>(this.fechaSistema.getFullYear());
  mesActual = signal<number>(this.fechaSistema.getMonth());

  diaSeleccionadoNumero = signal<number>(this.fechaSistema.getDate());
  diaSeleccionado = signal<string>('');

  mostrarSelectorModal = signal(false);

  mesesNombres = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  mesesAbreviados = [
    'ENER',
    'FEBR',
    'MARZ',
    'ABRL',
    'MAY',
    'JUN',
    'JUL',
    'AGOS',
    'SEPT',
    'OCT',
    'NOV',
    'DEC',
  ];

  eventosGlobales = signal<any[]>([]);

  diasMes = computed(() => {
    const cantidad = new Date(this.anioActual(), this.mesActual() + 1, 0).getDate();
    return Array.from({ length: cantidad }, (_, i) => i + 1);
  });

  diasPreviosVacios = computed(() => {
    let primerDiaSemana = new Date(this.anioActual(), this.mesActual(), 1).getDay();
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
    return Array.from({ length: primerDiaSemana });
  });

  eventosFiltrados = computed(() => {
    return this.eventosGlobales().filter((ev) => {
      if (ev.tipo === 'META' && !this.filtroMetas()) return false;
      if (ev.tipo === 'DEUDA' && !this.filtroDeudas()) return false;
      if (ev.tipo === 'SUSCRIPCION' && !this.filtroSuscripciones()) return false;
      return true;
    });
  });

  eventosDiaSeleccionado = computed(() => {
    return this.eventosFiltrados().filter((ev) => ev.fecha === this.diaSeleccionado());
  });

  ngOnInit(): void {
    this.actualizarFechaCadena(this.diaSeleccionadoNumero());
    this.cargarEventos();

    if (!this.sesion.esPremium()) {
      setTimeout(() => {
        this.dialog.open(CalendarioPremiumDialogo, {
          width: '490px',
          disableClose: true,
        });
      }, 100);
    }
  }

  private cargarEventos(): void {
    if (!this.sesion.esPremium()) return;
    this.calendarioService
      .listarEventosDelMes(this.anioActual(), this.mesActual() + 1)
      .subscribe((eventos) => {
        this.eventosGlobales.set(
          eventos.map((ev) => ({
            id: ev.tipo + '-' + ev.idOrigen + '-' + ev.fecha,
            idOrigen: ev.idOrigen,
            tipo: ev.tipo === 'SUSCRIPCION' ? 'SUSCRIPCION' : 'META',
            titulo: ev.nombre,
            monto: ev.monto,
            fecha: ev.fecha,
          })),
        );
      });
  }

  mesAnterior(): void {
    if (!this.sesion.esPremium()) return;
    if (this.mesActual() === 0) {
      this.mesActual.set(11);
      this.anioActual.update((a) => a - 1);
    } else {
      this.mesActual.update((m) => m - 1);
    }
    this.actualizarFechaCadena(1);
    this.cargarEventos();
  }

  mesSiguiente(): void {
    if (!this.sesion.esPremium()) return;
    if (this.mesActual() === 11) {
      this.mesActual.set(0);
      this.anioActual.update((a) => a + 1);
    } else {
      this.mesActual.update((m) => m + 1);
    }
    this.actualizarFechaCadena(1);
    this.cargarEventos();
  }

  cambiarAnioSelector(direccion: number): void {
    if (!this.sesion.esPremium()) return;
    this.anioActual.update((a) => a + direccion);
  }

  seleccionarMesRapido(indiceMes: number): void {
    if (!this.sesion.esPremium()) return;
    this.mesActual.set(indiceMes);
    this.mostrarSelectorModal.set(false);
    this.actualizarFechaCadena(1);
    this.cargarEventos();
  }

  obtenerEventosDia(dia: number): any[] {
    const mesStr = (this.mesActual() + 1).toString().padStart(2, '0');
    const diaStr = dia.toString().padStart(2, '0');
    return this.eventosFiltrados().filter(
      (ev) => ev.fecha === `${this.anioActual()}-${mesStr}-${diaStr}`,
    );
  }

  seleccionarDia(dia: number): void {
    if (!this.sesion.esPremium()) return;
    this.actualizarFechaCadena(dia);
  }

  esDiaSeleccionado(dia: number): boolean {
    return this.diaSeleccionadoNumero() === dia;
  }

  private actualizarFechaCadena(dia: number): void {
    const mesStr = (this.mesActual() + 1).toString().padStart(2, '0');
    const diaStr = dia.toString().padStart(2, '0');
    this.diaSeleccionadoNumero.set(dia);
    this.diaSeleccionado.set(`${this.anioActual()}-${mesStr}-${diaStr}`);
  }

  irAlDetalle(evento: any): void {
    if (evento.tipo === 'META') {
      void this.router.navigate(['/metas', evento.idOrigen]);
    } else if (evento.tipo === 'SUSCRIPCION') {
      void this.router.navigate(['/suscripciones'], { queryParams: { id: evento.idOrigen } });
    } else if (evento.tipo === 'DEUDA') {
      void this.router.navigate(['/movimientos']);
    }
  }
}
