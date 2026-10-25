import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Ventana "Nueva categoría" (Figura 42). Responsable: Matias.
 * Pendiente: campo Nombre (máx. 80 caracteres) → categoriaService.crear() → cerrar devolviendo la categoría creada.
 * Se abre desde SelectorCategorias con: this.dialog.open(CategoriaNuevaDialogo)
 */
@Component({
  selector: 'app-categoria-nueva-dialogo',
  imports: [],
  templateUrl: './categoria-nueva-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './categoria-nueva-dialogo.css',
})
export class CategoriaNuevaDialogo {}
