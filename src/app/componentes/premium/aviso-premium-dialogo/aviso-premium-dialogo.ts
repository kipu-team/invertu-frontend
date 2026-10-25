import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Aviso "Función exclusiva Premium" (Figuras 39, 41, 65). Responsable del diseño final: Matias.
 * Ya funciona en versión simple para que todos puedan usarlo desde ya:
 *
 *   this.dialog.open(AvisoPremiumDialogo, { data: { mensaje: 'premium.aviso.categorias' } });
 *
 * "mensaje" es opcional (clave de traducción); si no se envía, usa un texto general.
 */
@Component({
  selector: 'app-aviso-premium-dialogo',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './aviso-premium-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './aviso-premium-dialogo.css',
})
export class AvisoPremiumDialogo {
  datos = inject<{ mensaje?: string } | null>(MAT_DIALOG_DATA, { optional: true });
  private ref = inject(MatDialogRef<AvisoPremiumDialogo>);
  private router = inject(Router);

  irAPremium(): void {
    this.ref.close();
    this.router.navigate(['/pasar-premium']);
  }
}
