import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MetaService } from '../../../servicios/meta-service';
import { MetaDetalle as MetaDetalleDatos, Proyeccion } from '../../../modelo/meta';
import { SesionService } from '../../../servicios/sesion-service';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AporteService } from '../../../servicios/aporte-service';
import { Aporte } from '../../../modelo/aporte';
import { MatDialog } from '@angular/material/dialog';
import { AporteDialogo } from '../aporte-dialogo/aporte-dialogo';
import { MetaCumplidaDialogo } from '../meta-cumplida-dialogo/meta-cumplida-dialogo';
import { ExtenderFechaDialogo } from '../extender-fecha-dialogo/extender-fecha-dialogo';
@Component({
  selector: 'app-meta-detalle',
  imports: [
    TranslatePipe,
    DatePipe,
    DecimalPipe,
    MatButton,
    MatIconButton,
    MatIcon,
    MatProgressSpinner,
    RouterLink,
  ],
  templateUrl: './meta-detalle.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './meta-detalle.css',
})
export class MetaDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private metaService = inject(MetaService);
  private aporteService = inject(AporteService);
  sesion = inject(SesionService);
  private dialog = inject(MatDialog);
  id = 0;
  meta: MetaDetalleDatos | null = null;
  aportes: Aporte[] = [];
  proyeccion: Proyeccion | null = null;
  ngOnInit() {
    this.route.params.subscribe((data) => {
      this.id = +data['id'];
      this.cargarMeta();
      this.cargarAportes();
      this.cargarProyeccion();
    });
  }

  private cargarMeta() {
    this.metaService.obtenerDetalle(this.id).subscribe({
      next: (data) => {
        this.meta = data;
      },
    });
  }
  mes(fecha: string): string {
    return fecha.slice(5, 7);
  }

  anio(fecha: string): string {
    return fecha.slice(0, 4);
  }

  private cargarAportes() {
    this.aporteService.listar(this.id).subscribe({
      next: (data) => {
        this.aportes = data;
      },
    });
  }

  private cargarProyeccion() {
    this.metaService.obtenerProyeccion(this.id).subscribe({
      next: (data) => {
        this.proyeccion = data;
      },
    });
  }
  aportar() {
    if (!this.meta) return;
    this.dialog
      .open<AporteDialogo, MetaDetalleDatos, Aporte>(AporteDialogo, { data: this.meta })
      .afterClosed()
      .subscribe((aporte) => {
        if (!aporte) return;
        this.cargarMeta();
        this.cargarAportes();
        this.cargarProyeccion();
        if (aporte.estadoMeta === 'CUMPLIDA') {
          this.dialog.open(MetaCumplidaDialogo);
        }
      });
  }

  extender() {
    if (!this.meta) return;
    this.dialog
      .open<ExtenderFechaDialogo, void, string>(ExtenderFechaDialogo)
      .afterClosed()
      .subscribe((fecha) => {
        if (!fecha) return;
        this.metaService.extenderFecha(this.id, { nuevaFechaObjetivo: fecha }).subscribe(() => {
          this.cargarMeta();
          this.cargarProyeccion();
        });
      });
  }
}
