import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { SuscripcionService } from '../../../servicios/suscripcion-service';
import { SuscripcionResumen } from '../../../modelo/suscripcion';
import { EstadoSuscripcion } from '../../../modelo/comun';
import { SuscripcionDetalleDialogo } from '../suscripcion-detalle-dialogo/suscripcion-detalle-dialogo';
import { SuscripcionFormulario } from '../suscripcion-formulario/suscripcion-formulario';
import { SuscripcionMensajeDialogo } from '../suscripcion-mensaje-dialogo/suscripcion-mensaje-dialogo';
import { ReactivarDialogo } from '../reactivar-dialogo/reactivar-dialogo';
import { ConfirmarDialogo } from '../../compartidos/confirmar-dialogo/confirmar-dialogo';

/** Filtro de la lista: todas, solo activas o solo canceladas */
type FiltroEstado = 'TODAS' | EstadoSuscripcion;

@Component({
  selector: 'app-suscripciones',
  imports: [DatePipe, DecimalPipe, MatButton, MatIcon, TranslatePipe, SuscripcionFormulario],
  templateUrl: './suscripciones.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './suscripciones.css',
})
export class Suscripciones implements OnInit {
  private suscripcionService = inject(SuscripcionService);
  private dialog = inject(MatDialog);
  private panel = viewChild.required(SuscripcionFormulario);
  readonly filtros: FiltroEstado[] = ['TODAS', 'ACTIVA', 'CANCELADA'];

  suscripciones = signal<SuscripcionResumen[]>([]);
  filtro = signal<FiltroEstado>('TODAS');

  // Lo que se muestra según el filtro elegido
  suscripcionesFiltradas = computed(() =>
    this.suscripciones().filter((s) => this.filtro() === 'TODAS' || s.estado === this.filtro()),
  );

  // Números de las 3 tarjetas de resumen
  totalActivas = computed(() => this.suscripciones().filter((s) => s.estado === 'ACTIVA').length);
  totalCanceladas = computed(
    () => this.suscripciones().filter((s) => s.estado === 'CANCELADA').length,
  );
  totalProximas = computed(
    () =>
      this.suscripciones().filter(
        (s) => s.estado === 'ACTIVA' && this.cobraPronto(s.proximaFechaCobro),
      ).length,
  );

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.suscripcionService.listar().subscribe((data) => this.suscripciones.set(data));
  }

  // US-27: abre la ventana de detalle; al cerrarla se recarga la lista por si hubo cambios
  verDetalle(id: number): void {
    this.dialog
      .open(SuscripcionDetalleDialogo, { data: id, width: '560px', maxWidth: '95vw' })
      .afterClosed()
      .subscribe((resultado) => {
        this.cargar();
        // US-29: "Editar suscripción" en el detalle cierra la ventana con 'editar'
        if (resultado === 'editar') this.editar(id);
        // US-30: "Cancelar suscripción" y "Reactivar" del detalle
        if (resultado === 'cancelar') this.cancelar(id);
        if (resultado === 'reactivar') this.reactivar(id);
      });
  }

  // US-29: carga la suscripción en el panel de la derecha (Figura 49)
  editar(id: number): void {
    this.panel().editar(id);
  }

  // US-30: pide confirmación y cancela (Figura 61)
  cancelar(id: number): void {
    this.dialog
      .open(ConfirmarDialogo, {
        data: {
          titulo: 'suscripciones.cancelar.titulo',
          mensaje: 'suscripciones.cancelar.mensaje',
          textoConfirmar: 'suscripciones.cancelar.confirmar',
          textoCancelar: 'suscripciones.cancelar.volver',
          peligro: true,
        },
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((confirmo) => {
        if (!confirmo) return;
        this.suscripcionService.cancelar(id).subscribe(() => {
          if (this.panel().idEditando() === id) this.panel().limpiar(); // ya no se puede editar
          this.cargar();
          this.mostrarMensaje(
            'suscripciones.mensajes.canceladaTitulo',
            'suscripciones.mensajes.canceladaTexto',
          );
        });
      });
  }

  // US-30: pide la nueva fecha de cobro y reactiva (Figuras 58 y 60)
  reactivar(id: number): void {
    const nombre = this.suscripciones().find((s) => s.idSuscripcion === id)?.nombreServicio ?? '';
    this.dialog
      .open(ReactivarDialogo, { data: nombre, width: '420px', maxWidth: '95vw' })
      .afterClosed()
      .subscribe((fecha) => {
        if (!fecha) return;
        this.suscripcionService.reactivar(id, { proximaFechaCobro: fecha }).subscribe(() => {
          this.cargar();
          this.mostrarMensaje(
            'suscripciones.mensajes.reactivadaTitulo',
            'suscripciones.mensajes.reactivadaTexto',
          );
        });
      });
  }

  private mostrarMensaje(titulo: string, mensaje: string): void {
    this.dialog.open(SuscripcionMensajeDialogo, {
      data: { tipo: 'exito', titulo, mensaje, boton: 'suscripciones.mensajes.continuar' },
      width: '420px',
      maxWidth: '95vw',
    });
  }

  // Próxima renovación = el cobro es dentro de los próximos 7 días
  private cobraPronto(fecha: string): boolean {
    const dias = (new Date(fecha + 'T00:00:00').getTime() - Date.now()) / 86_400_000;
    return dias >= -1 && dias <= 7;
  }
}
