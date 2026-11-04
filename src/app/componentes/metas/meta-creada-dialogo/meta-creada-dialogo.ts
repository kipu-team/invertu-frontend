import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

export interface DatosMetaDialogo {
  mensaje: string;
  boton: string;
}

@Component({
  selector: 'app-meta-creada-dialogo',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButton, MatIcon, TranslatePipe],
  templateUrl: './meta-creada-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './meta-creada-dialogo.css',
})
export class MetaCreadaDialogo {
  datos = inject<DatosMetaDialogo>(MAT_DIALOG_DATA);
}
