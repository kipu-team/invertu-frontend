import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MovimientoService } from '../../../servicios/movimiento-service';
import { CategoriaService } from '../../../servicios/categoria-service';
import { MovimientoItem } from '../../../modelo/movimiento';
import { Categoria } from '../../../modelo/categoria';
import { Clasificacion, MedioPago, TipoMovimiento } from '../../../modelo/comun';

@Component({
  selector: 'app-movimientos',
  imports: [
    TranslatePipe,
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButton,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './movimientos.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './movimientos.css',
})
export class Movimientos implements OnInit {
  private movimientoService = inject(MovimientoService);
  private categoriaService = inject(CategoriaService);
  private fb = inject(FormBuilder);

  // Tabla de US-10
  columnas: string[] = ['fecha', 'descripcion', 'categoria', 'clasificacion', 'monto'];
  dataSource: MatTableDataSource<MovimientoItem> = new MatTableDataSource<MovimientoItem>();
  anio: number = new Date().getFullYear();
  mes: number = new Date().getMonth() + 1;

  // Búsqueda y filtros de US-14)
  // Opciones de filtros
  tipos: TipoMovimiento[] = ['INGRESO', 'GASTO'];
  clasificaciones: Clasificacion[] = ['FIJO', 'VARIABLE'];
  mediosPago: MedioPago[] = [
    'EFECTIVO',
    'TRANSFERENCIA',
    'TARJETA_DEBITO',
    'TARJETA_CREDITO',
    'BILLETERA_DIGITAL',
    'OTRO',
  ];
  categorias: Categoria[] = [];

  // buscar en barra de búsqueda
  busqueda = new FormControl('', { nonNullable: true });

  panelAbierto: boolean = false;

  // Formulario del panel
  filtrosForm = this.fb.group({
    tipo: [null as TipoMovimiento | null],
    clasificacion: [null as Clasificacion | null],
    idCategoria: [null as number | null],
    medioPago: [null as MedioPago | null],
  });

  filtrosAplicados = this.filtrosForm.getRawValue();

  ngOnInit(): void {
    this.categoriaService.listar().subscribe((data) => (this.categorias = data));
    this.busqueda.valueChanges.subscribe(() => this.cargar());
    this.cargar();
  }

  cargar(): void {
    const f = this.filtrosAplicados;
    this.movimientoService
      .listar({
        anio: this.anio,
        mes: this.mes,
        busqueda: this.busqueda.value.trim(),
        tipo: f.tipo ?? undefined,
        clasificacion: f.clasificacion ?? undefined,
        idCategoria: f.idCategoria ?? undefined,
        medioPago: f.medioPago ?? undefined,
      })
      .subscribe((data) => {
        // borrar cuando se conecte la API
        const prefijo = `${this.anio}-${String(this.mes).padStart(2, '0')}`;
        this.dataSource.data = data.movimientos.filter((m) => m.fecha.startsWith(prefijo));
      });
  }

  get criteriosActivos(): number {
    return Object.values(this.filtrosAplicados).filter((v) => v !== null).length;
  }

  get hayBusqueda(): boolean {
    return this.busqueda.value.trim() !== '' || this.criteriosActivos > 0;
  }

  aplicarFiltros(): void {
    this.filtrosAplicados = this.filtrosForm.getRawValue();
    this.panelAbierto = false;
    this.cargar();
  }

  limpiarFiltros(): void {
    this.filtrosForm.reset();
    this.aplicarFiltros();
  }

  limpiarTodo(): void {
    this.busqueda.setValue('', { emitEvent: false });
    this.limpiarFiltros();
  }

  cerrarPanel(): void {
    this.filtrosForm.setValue(this.filtrosAplicados);
    this.panelAbierto = false;
  }

  mesAnterior(): void {
    if (this.mes === 1) {
      this.mes = 12;
      this.anio--;
    } else {
      this.mes--;
    }
    this.cargar();
  }

  mesSiguiente(): void {
    if (this.mes === 12) {
      this.mes = 1;
      this.anio++;
    } else {
      this.mes++;
    }
    this.cargar();
  }
}
