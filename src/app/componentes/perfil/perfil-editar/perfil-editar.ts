
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

import { Perfil, PerfilRequest } from '../../../modelo/perfil';
import { PerfilService } from '../../../servicios/perfil-service';
import { UNIVERSIDADES } from '../../../servicios/datos-prueba/datos-prueba';

@Component({
  selector: 'app-perfil-editar',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    TranslatePipe
  ],
  templateUrl: './perfil-editar.html',
  styleUrl: './perfil-editar.css'
})
export class PerfilEditar {
  universidades = UNIVERSIDADES;

  private perfilService = inject(PerfilService);

  @Input({ required: true }) perfil!: Perfil;

  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<Perfil>();

  nombres = '';
  apellidos = '';
  universidad = '';
  mensajeError = '';
  guardando = false;

  ngOnInit(): void {
    this.nombres = this.perfil.nombres;
    this.apellidos = this.perfil.apellidos;
    this.universidad = this.perfil.universidad ?? '';
  }

  guardar(): void {
    this.mensajeError = '';

    const nombres = this.nombres.trim();
    const apellidos = this.apellidos.trim();
    const universidad = this.universidad.trim();

    if (!nombres || !apellidos) {
      this.mensajeError = 'Completa los nombres y apellidos.';
      return;
    }

    const datos: PerfilRequest = {
      nombres,
      apellidos,
      universidad
    };

    this.guardando = true;

    this.perfilService.actualizar(datos).subscribe({
      next: (perfilActualizado: Perfil) => {
        this.guardado.emit(perfilActualizado);
        this.guardando = false;
      },
      error: () => {
        this.mensajeError = 'No se pudo actualizar el perfil.';
        this.guardando = false;
      }
    });
  }
}
