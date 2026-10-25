import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

/** Todos los textos son claves de traducción. */
export interface DatosConfirmacion {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string; // por defecto: "Confirmar"
  textoCancelar?: string; // por defecto: "Cancelar"
  peligro?: boolean; // true = botón rojo (eliminar, cancelar meta...)
}

/**
 * Ventana de confirmación reutilizable (eliminar movimiento, cancelar meta, cerrar sesión...).
 *
 * Uso:
 *   private dialog = inject(MatDialog);
 *   this.dialog.open(ConfirmarDialogo, { data: { titulo: 'movimientos.eliminar.titulo', mensaje: '...', peligro: true } })
 *     .afterClosed().subscribe(confirmo => { if (confirmo) { ... } });
 */
@Component({
  selector: 'app-confirmar-dialogo',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    TranslatePipe,
  ],
  templateUrl: './confirmar-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './confirmar-dialogo.css',
})
export class ConfirmarDialogo {
  datos = inject<DatosConfirmacion>(MAT_DIALOG_DATA);
}
