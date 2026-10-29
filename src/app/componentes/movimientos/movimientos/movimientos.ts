import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MovimientoService } from '../../../servicios/movimiento-service';
import { MovimientoItem } from '../../../modelo/movimiento';

@Component({
  selector: 'app-movimientos',
  imports: [
    TranslatePipe,
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatChipsModule,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './movimientos.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './movimientos.css',
})
export class Movimientos implements OnInit {
  private movimientoService = inject(MovimientoService);

  columnas: string[] = ['fecha', 'descripcion', 'categoria', 'clasificacion', 'monto'];
  dataSource: MatTableDataSource<MovimientoItem> = new MatTableDataSource<MovimientoItem>();

  anio: number = new Date().getFullYear();
  mes: number = new Date().getMonth() + 1;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.movimientoService.listar({ anio: this.anio, mes: this.mes }).subscribe((data) => {
      // Borrar cuando se traiga API
      const prefijo = `${this.anio}-${String(this.mes).padStart(2, '0')}`;
      this.dataSource.data = data.movimientos.filter((m) => m.fecha.startsWith(prefijo));
    });
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
