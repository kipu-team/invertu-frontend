import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MetaService } from '../../../servicios/meta-service';
import { MetaResumen } from '../../../modelo/meta';

@Component({
  selector: 'app-metas-listar',
  imports: [TranslatePipe, DecimalPipe, MatButton, MatIcon, MatProgressSpinner],
  templateUrl: './metas-listar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './metas-listar.css',
})
export class MetasListar implements OnInit {
  private metaService = inject(MetaService);

  destacada: MetaResumen | null = null;
  otras: MetaResumen[] = [];
  finalizadas: MetaResumen[] = [];

  ngOnInit(): void {
    this.metaService.listarActivas().subscribe((data) => {
      const ordenadas = [...data].sort((a, b) => a.fechaObjetivo.localeCompare(b.fechaObjetivo));
      this.destacada = ordenadas[0] ?? null;
      this.otras = ordenadas.slice(1);
    });

    this.metaService.listarFinalizadas().subscribe((data) => {
      this.finalizadas = data;
    });
  }

  mes(fecha: string): string {
    return fecha.slice(5, 7);
  }

  anio(fecha: string): string {
    return fecha.slice(0, 4);
  }
}
