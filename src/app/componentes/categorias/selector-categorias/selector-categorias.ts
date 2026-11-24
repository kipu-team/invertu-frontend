import { Component, OnInit, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { CategoriaService } from '../../../servicios/categoria-service';
import { SesionService } from '../../../servicios/sesion-service';
import { Categoria } from '../../../modelo/categoria';
import { CategoriaNuevaDialogo } from '../categoria-nueva-dialogo/categoria-nueva-dialogo';
import { ConfirmarDialogo } from '../../compartidos/confirmar-dialogo/confirmar-dialogo';
import { AvisoPremiumDialogo } from '../../premium/aviso-premium-dialogo/aviso-premium-dialogo';

@Component({
  selector: 'app-selector-categorias',
  imports: [MatChipsModule, MatIcon, TranslatePipe],
  templateUrl: './selector-categorias.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './selector-categorias.css',
})
export class SelectorCategorias implements OnInit {
  seleccionada = model<number | null>(null);

  private categoriaService = inject(CategoriaService);
  sesion = inject(SesionService);
  private dialog = inject(MatDialog);

  categorias: Categoria[] = [];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.categoriaService.listar().subscribe((data) => (this.categorias = data));
  }

  crear(): void {
    if (!this.sesion.esPremium()) {
      this.dialog.open(AvisoPremiumDialogo, { data: { mensaje: 'categorias.aviso.crear' } });
      return;
    }
    this.dialog
      .open(CategoriaNuevaDialogo)
      .afterClosed()
      .subscribe((nueva?: Categoria) => {
        if (nueva) {
          this.cargar();
          this.seleccionada.set(nueva.idCategoria);
        }
      });
  }

  eliminar(categoria: Categoria): void {
    if (!this.sesion.esPremium()) {
      this.dialog.open(AvisoPremiumDialogo, { data: { mensaje: 'categorias.aviso.eliminar' } });
      return;
    }
    this.dialog
      .open(ConfirmarDialogo, {
        data: {
          titulo: 'categorias.eliminar.titulo',
          mensaje: 'categorias.eliminar.mensaje',
          textoConfirmar: 'categorias.eliminar.confirmar',
          peligro: true,
        },
      })
      .afterClosed()
      .subscribe((confirmo) => {
        if (confirmo) {
          this.categoriaService.desactivar(categoria.idCategoria).subscribe(() => {
            if (this.seleccionada() === categoria.idCategoria) {
              this.seleccionada.set(null);
            }
            this.cargar();
          });
        }
      });
  }
}
