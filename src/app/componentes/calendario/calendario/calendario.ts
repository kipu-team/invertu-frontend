import { Component, ChangeDetectionStrategy, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { SesionService } from '../../../servicios/sesion-service';
import { CalendarioPremiumDialogo } from '../calendario-premium-dialogo/calendario-premium-dialogo';
import { EVENTOS_PRUEBA } from '../../../servicios/datos-prueba/datos-prueba';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class Calendario implements OnInit {
  private dialog = inject(MatDialog);
  public sesion = inject(SesionService);

  filtroMetas = signal(true);
  filtroDeudas = signal(true);
  filtroSuscripciones = signal(true);

  fechaSistema = new Date();
  anioActual = signal<number>(this.fechaSistema.getFullYear());
  mesActual = signal<number>(this.fechaSistema.getMonth());
  diaSeleccionado = signal<string>('');

  mostrarSelectorModal = signal(false);

  mesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  mesesAbreviados = [
    'ENER', 'FEBR', 'MARZ', 'ABRL', 'MAY', 'JUN',
    'JUL', 'AGOS', 'SEPT', 'OCT', 'NOV', 'DEC'
  ];

  eventosGlobales = signal<any[]>(EVENTOS_PRUEBA);

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
    return this.eventosGlobales().filter(ev => {
      if (ev.tipo === 'META' && !this.filtroMetas()) return false;
      if (ev.tipo === 'DEUDA' && !this.filtroDeudas()) return false;
      if (ev.tipo === 'SUSCRIPCION' && !this.filtroSuscripciones()) return false;
      return true;
    });
  });

  ngOnInit(): void {
    const mStr = (this.fechaSistema.getMonth() + 1).toString().padStart(2, '0');
    const dStr = this.fechaSistema.getDate().toString().padStart(2, '0');
    this.diaSeleccionado.set(`${this.fechaSistema.getFullYear()}-${mStr}-${dStr}`);

    if (!this.sesion.esPremium()) {
      setTimeout(() => {
        this.dialog.open(CalendarioPremiumDialogo, {
          width: '490px',
          disableClose: true
        });
      }, 100);
    }
  }

  mesAnterior(): void {
    if (!this.sesion.esPremium()) return;
    if (this.mesActual() === 0) {
      this.mesActual.set(11);
      this.anioActual.update(a => a - 1);
    } else {
      this.mesActual.update(m => m - 1);
    }
  }

  mesSiguiente(): void {
    if (!this.sesion.esPremium()) return;
    if (this.mesActual() === 11) {
      this.mesActual.set(0);
      this.anioActual.update(a => a + 1);
    } else {
      this.mesActual.update(m => m + 1);
    }
  }

  cambiarAnioSelector(direccion: number): void {
    this.anioActual.update(a => a + direccion);
  }

  seleccionarMesRapido(indiceMes: number): void {
    this.mesActual.set(indiceMes);
    this.mostrarSelectorModal.set(false);
    const mesStr = (indiceMes + 1).toString().padStart(2, '0');
    this.diaSeleccionado.set(`${this.anioActual()}-${mesStr}-06`);
  }

  obtenerEventosDia(dia: number): any[] {
    const mesFormateado = (this.mesActual() + 1).toString().padStart(2, '0');
    const diaFormateado = dia.toString().padStart(2, '0');
    const fechaStr = `${this.anioActual()}-${mesFormateado}-${diaFormateado}`;
    return this.eventosFiltrados().filter(ev => ev.fecha === fechaStr);
  }

  esDiaSeleccionado(dia: number): boolean {
    const mesFormateado = (this.mesActual() + 1).toString().padStart(2, '0');
    const diaFormateado = dia.toString().padStart(2, '0');
    return this.diaSeleccionado() === `${this.anioActual()}-${mesFormateado}-${diaFormateado}`;
  }
}
