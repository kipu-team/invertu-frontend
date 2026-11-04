import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MetaService } from '../../../servicios/meta-service';
import { MetaResumen } from '../../../modelo/meta';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ExtenderFechaDialogo } from '../extender-fecha-dialogo/extender-fecha-dialogo';
import {
  ConfirmarDialogo,
  DatosConfirmacion,
} from '../../compartidos/confirmar-dialogo/confirmar-dialogo';

@Component({
  selector: 'app-metas-listar',
  imports: [
    TranslatePipe,
    DecimalPipe,
    NgTemplateOutlet,
    MatButton,
    MatIcon,
    MatProgressSpinner,
    RouterLink,
  ],
  templateUrl: './metas-listar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './metas-listar.css',
})
export class MetasListar implements OnInit {
  private metaService = inject(MetaService);
  private dialog = inject(MatDialog);
  private traductor = inject(TranslateService);

  destacada: MetaResumen | null = null;
  otras: MetaResumen[] = [];
  finalizadas: MetaResumen[] = [];
  actualizadaId: number | null = null;

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.metaService.listarActivas().subscribe((data) => {
      const ordenadas = [...data].sort((a, b) => a.fechaObjetivo.localeCompare(b.fechaObjetivo));
      this.destacada = ordenadas[0] ?? null;
      this.otras = ordenadas.slice(1);
    });

    this.metaService.listarFinalizadas().subscribe((data) => {
      this.finalizadas = data;
    });
  }

  extender(meta: MetaResumen): void {
    this.dialog
      .open<ExtenderFechaDialogo, void, string>(ExtenderFechaDialogo)
      .afterClosed()
      .subscribe((fecha) => {
        if (!fecha) return;
        this.metaService.extenderFecha(meta.idMeta, { nuevaFechaObjetivo: fecha }).subscribe(() => {
          this.actualizadaId = meta.idMeta;
          this.cargar();
        });
      });
  }

  eliminar(meta: MetaResumen): void {
    this.dialog
      .open<ConfirmarDialogo, DatosConfirmacion, boolean>(ConfirmarDialogo, {
        data: {
          titulo: this.traductor.instant('metas.eliminar.titulo', { nombre: meta.nombre }),
          mensaje: 'metas.eliminar.mensaje',
          textoConfirmar: 'metas.eliminar.confirmar',
          peligro: true,
        },
      })
      .afterClosed()
      .subscribe((confirmo) => {
        if (!confirmo) return;
        this.metaService.eliminar(meta.idMeta).subscribe(() => this.cargar());
      });
  }

  mes(fecha: string): string {
    return fecha.slice(5, 7);
  }

  anio(fecha: string): string {
    return fecha.slice(0, 4);
  }
}
