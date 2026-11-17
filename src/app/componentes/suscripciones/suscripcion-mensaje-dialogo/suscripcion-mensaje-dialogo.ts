import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/** Datos de la ventana: tipo (éxito o error) y claves de traducción */
export interface MensajeDialogo {
  tipo: 'exito' | 'error';
  titulo: string;
  mensaje: string;
  boton: string;
}

@Component({
  selector: 'app-suscripcion-mensaje-dialogo',
  imports: [MatDialogClose, MatButton, MatIconButton, MatIcon, TranslatePipe],
  templateUrl: './suscripcion-mensaje-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './suscripcion-mensaje-dialogo.css',
})
export class SuscripcionMensajeDialogo {
  datos = inject<MensajeDialogo>(MAT_DIALOG_DATA);
}
