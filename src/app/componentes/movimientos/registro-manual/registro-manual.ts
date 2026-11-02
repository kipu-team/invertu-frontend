import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Injectable,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MovimientoService } from '../../../servicios/movimiento-service';
import { SuscripcionService } from '../../../servicios/suscripcion-service';
import { MovimientoRequest } from '../../../modelo/movimiento';
import { SuscripcionResumen } from '../../../modelo/suscripcion';
import { Clasificacion, MedioPago, TipoMovimiento } from '../../../modelo/comun';
import { SelectorCategorias } from '../../categorias/selector-categorias/selector-categorias';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  NativeDateAdapter,
} from '@angular/material/core';

// La fecha no puede ser futura, regla @PastOrPresent del backend
function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  const valor: Date | null = control.value;
  if (!valor) return null;
  const finDeHoy = new Date();
  finDeHoy.setHours(23, 59, 59, 999);
  return valor > finDeHoy ? { fechaFutura: true } : null;
}

// Para que al escribir "05/10/2026" se lea como 5 de octubre (DD/MM/AAAA) y no como 10 de mayo
@Injectable()
class AdaptadorFechaPeru extends NativeDateAdapter {
  override parse(valor: unknown): Date | null {
    if (typeof valor === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(valor.trim())) {
      const [dia, mes, anio] = valor.trim().split('/').map(Number);
      return new Date(anio, mes - 1, dia);
    }
    return super.parse(valor);
  }
}

const FORMATO_FECHA = {
  ...MAT_NATIVE_DATE_FORMATS,
  display: {
    ...MAT_NATIVE_DATE_FORMATS.display,
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
  },
};

interface ResumenRegistro {
  tipo: TipoMovimiento;
  monto: number;
  descripcion: string;
  fecha: string;
  categoria: string;
  clasificacion: Clasificacion;
  medioPago: MedioPago | null;
  suscripcion: string | null;
}

@Component({
  selector: 'app-registro-manual',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    DatePipe,
    DecimalPipe,
    MatButton,
    MatIconButton,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIcon,
    SelectorCategorias,
    MatDatepickerModule,
  ],
  templateUrl: './registro-manual.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './registro-manual.css',
  providers: [
    { provide: DateAdapter, useClass: AdaptadorFechaPeru },
    { provide: MAT_DATE_FORMATS, useValue: FORMATO_FECHA },
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
  ],
})
export class RegistroManual implements OnInit {
  // Avisos hacia la página de movimientos
  @Output() volver = new EventEmitter<void>();
  @Output() registrado = new EventEmitter<void>();
  private fb = inject(FormBuilder);
  private movimientoService = inject(MovimientoService);
  private suscripcionService = inject(SuscripcionService);

  tipos: TipoMovimiento[] = ['GASTO', 'INGRESO'];
  clasificaciones: Clasificacion[] = ['FIJO', 'VARIABLE'];
  mediosPago: MedioPago[] = [
    'EFECTIVO',
    'TRANSFERENCIA',
    'TARJETA_DEBITO',
    'TARJETA_CREDITO',
    'BILLETERA_DIGITAL',
    'OTRO',
  ];
  suscripciones: SuscripcionResumen[] = [];
  hoy: Date = new Date();
  // todavía no se registró
  resumen: ResumenRegistro | null = null;

  formulario = this.fb.group({
    tipo: ['INGRESO' as TipoMovimiento, Validators.required],
    clasificacion: ['FIJO' as Clasificacion, Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(250)]],
    fecha: [new Date() as Date | null, [Validators.required, fechaNoFutura]],
    monto: [
      null as number | null,
      [Validators.required, Validators.min(0.01), Validators.pattern(/^\d{1,10}(\.\d{1,2})?$/)],
    ],
    idCategoria: [null as number | null, Validators.required],
    medioPago: [null as MedioPago | null],
    idSuscripcion: [null as number | null],
  });

  get descripcion() {
    return this.formulario.controls.descripcion;
  }
  get fecha() {
    return this.formulario.controls.fecha;
  }
  get monto() {
    return this.formulario.controls.monto;
  }
  get idCategoria() {
    return this.formulario.controls.idCategoria;
  }
  get esGasto(): boolean {
    return this.formulario.controls.tipo.value === 'GASTO';
  }

  ngOnInit(): void {
    this.suscripcionService.listar('ACTIVA').subscribe((data) => (this.suscripciones = data));

    // La suscripción solo aplica a gastos, si cambia a Ingreso se borra
    this.formulario.controls.tipo.valueChanges.subscribe((tipo) => {
      if (tipo === 'INGRESO') {
        this.formulario.controls.idSuscripcion.setValue(null);
      }
    });
  }

  registrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const v = this.formulario.getRawValue();
    const datos: MovimientoRequest = {
      tipo: v.tipo as TipoMovimiento,
      clasificacion: v.clasificacion as Clasificacion,
      descripcion: (v.descripcion ?? '').trim(),
      fecha: v.fecha ? v.fecha.toLocaleDateString('en-CA') : '',
      monto: v.monto ?? 0,
      idCategoria: v.idCategoria ?? 0,
      medioPago: v.medioPago,
      idSuscripcion: v.tipo === 'GASTO' ? v.idSuscripcion : null,
    };

    this.movimientoService.registrar(datos).subscribe((mov) => {
      this.resumen = {
        tipo: mov.tipo,
        monto: mov.monto,
        descripcion: mov.descripcion,
        fecha: mov.fecha,
        categoria: mov.categoria,
        clasificacion: datos.clasificacion,
        medioPago: datos.medioPago ?? null,
        suscripcion:
          this.suscripciones.find((s) => s.idSuscripcion === datos.idSuscripcion)?.nombreServicio ??
          null,
      };
      this.registrado.emit(); // la página recarga la tabla
    });
  }

  // Botón "Registrar otro": vuelve al formulario vacío
  nuevoRegistro(): void {
    this.resumen = null;
    this.formulario.reset({
      tipo: 'INGRESO',
      clasificacion: 'FIJO',
      descripcion: '',
      fecha: new Date(),
      monto: null,
      idCategoria: null,
      medioPago: null,
      idSuscripcion: null,
    });
  }
}
