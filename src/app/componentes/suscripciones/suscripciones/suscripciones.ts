import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';
import { SuscripcionService } from '../../../servicios/suscripcion-service';
import { SuscripcionResumen } from '../../../modelo/suscripcion';
import { EstadoSuscripcion } from '../../../modelo/comun';

@Component({
  selector: 'app-suscripciones',
  imports: [EnConstruccion],
  templateUrl: './suscripciones.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './suscripciones.css',
})
export class Suscripciones implements OnInit {
  private suscripcionService = inject(SuscripcionService);

  suscripciones = signal<SuscripcionResumen[]>([]);
  estadoElegido = signal<EstadoSuscripcion>('ACTIVA');

  // Solo las del estado elegido (Activas o Canceladas)
  suscripcionesFiltradas = computed(() =>
    this.suscripciones().filter((s) => s.estado === this.estadoElegido()),
  );

  pendientes = [
    'Listado de tarjetas + formulario lateral de registro/edición (47–51, 57, 59)',
    'Detalle con historial de pagos, "Pago sin registrar", recordatorio y alerta de saldo (52–55, 63–65)',
    'Cancelar y reactivar (58, 60–62); estado vacío (56)',
  ];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.suscripcionService.listar().subscribe((data) => this.suscripciones.set(data));
  }
}
