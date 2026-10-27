import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MetaService } from '../../../servicios/meta-service';
import { MetaResumen } from '../../../modelo/meta';
@Component({
  selector: 'app-metas-listar',
  imports: [TranslatePipe, MatButton, MatIcon],
  templateUrl: './metas-listar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './metas-listar.css',
})
export class MetasListar implements OnInit {
  private metaService = inject(MetaService);
  activas: MetaResumen[] = [];
  finalizadas: MetaResumen[] = [];
  ngOnInit(): void {
    this.metaService.listarActivas().subscribe((data) => {
      this.activas = data;
      console.log(data);
    });

    this.metaService.listarFinalizadas().subscribe((data) => {
      this.finalizadas = data;
    });
  }
}
