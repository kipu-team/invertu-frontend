import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

import { Perfil as PerfilModelo } from '../../../modelo/perfil';
import { PerfilService } from '../../../servicios/perfil-service';
import { SesionService } from '../../../servicios/sesion-service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './perfil.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private perfilService = inject(PerfilService);
  public sesion = inject(SesionService);

  perfil = signal<PerfilModelo | null>(null);

  iniciales = computed(() => {
    const p = this.perfil();
    return p ? (p.nombres.charAt(0) + p.apellidos.charAt(0)).toUpperCase() : '';
  });

  ngOnInit(): void {
    this.perfilService.obtener().subscribe((data: PerfilModelo) => {
      this.perfil.set(data);
    });
  }
}
