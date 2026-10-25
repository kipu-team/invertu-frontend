import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { TranslatePipe } from '@ngx-translate/core';
import { SesionService } from '../../../servicios/sesion-service';
import { IdiomaService } from '../../../servicios/idioma-service';
import { ConfirmarDialogo } from '../confirmar-dialogo/confirmar-dialogo';

@Component({
  selector: 'app-cabecera',
  imports: [
    RouterLink,
    MatIcon,
    MatButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatDivider,
    TranslatePipe,
  ],
  templateUrl: './cabecera.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './cabecera.css',
})
export class Cabecera {
  sesion = inject(SesionService);
  idioma = inject(IdiomaService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  /** Figura 99: confirmación de cierre de sesión. Por ahora solo vuelve al login (aún no hay token que borrar). */
  confirmarCierreSesion(): void {
    this.dialog
      .open(ConfirmarDialogo, {
        data: {
          titulo: 'compartido.cerrarSesion.titulo',
          mensaje: 'compartido.cerrarSesion.mensaje',
          textoConfirmar: 'compartido.cerrarSesion.confirmar',
        },
      })
      .afterClosed()
      .subscribe((confirmo) => {
        if (confirmo) {
          this.router.navigate(['/iniciar-sesion']);
        }
      });
  }
}
