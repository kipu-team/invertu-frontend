import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Perfil as PerfilModelo } from '../../../modelo/perfil';
import { PerfilService } from '../../../servicios/perfil-service';
import { SesionService } from '../../../servicios/sesion-service';
import { PerfilEditar } from '../perfil-editar/perfil-editar';
import { Preferencias } from '../preferencias/preferencias';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    PerfilEditar,
    Preferencias
  ],
  templateUrl: './perfil.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private perfilService = inject(PerfilService);
  public sesion = inject(SesionService);

  editando = signal(false);

  private route = inject(ActivatedRoute);
  pestana = signal<'perfil' | 'configuracion'>('perfil');

  perfil = signal<PerfilModelo | null>(null);

  iniciales = computed(() => {
    const p = this.perfil();
    return p ? (p.nombres.charAt(0) + p.apellidos.charAt(0)).toUpperCase() : '';
  });
  abrirEdicion(): void {
    this.editando.set(true);
  }

  cancelarEdicion(): void {
    this.editando.set(false);
  }

  guardarEdicion(perfilActualizado: PerfilModelo): void {
    this.perfil.set(perfilActualizado);
    this.editando.set(false);
  }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {
      const pestana = params.get('pestana');

      this.pestana.set(
        pestana === 'configuracion' ? 'configuracion' : 'perfil'
      );

      // Al cambiar a configuración, salimos del modo edición del perfil.
      if (pestana === 'configuracion') {
        this.editando.set(false);
      }
    });

    this.perfilService.obtener().subscribe((data: PerfilModelo) => {
      this.perfil.set(data);
    });

  }
}
