import { Component, OnInit, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { CategoriaService } from '../../../servicios/categoria-service';
import { Categoria } from '../../../modelo/categoria';

/**
 * Chips de categoría para el formulario de movimientos (Figuras 34, 39–42). Responsable: Matias.
 *
 * Meme lo usa así en su formulario (NO cambies este "contrato" sin avisarle):
 *   <app-selector-categorias [(seleccionada)]="idCategoria" />
 *
 * Pendiente (Matias):
 *  - Mostrar como chips (mat-chip-listbox) con el estilo de los mockups
 *  - "+ Crear categoría": Premium → CategoriaNuevaDialogo (42) / Free → AvisoPremiumDialogo (39, 41)
 *  - "x" en las personalizadas → ConfirmarDialogo (40) → categoriaService.desactivar(id)
 */
@Component({
  selector: 'app-selector-categorias',
  imports: [],
  templateUrl: './selector-categorias.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './selector-categorias.css',
})
export class SelectorCategorias implements OnInit {
  /** idCategoria elegida (enlace de doble vía con el formulario). */
  seleccionada = model<number | null>(null);

  private categoriaService = inject(CategoriaService);
  categorias: Categoria[] = [];

  ngOnInit(): void {
    this.categoriaService.listar().subscribe((data) => (this.categorias = data));
  }
}
