import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-meta-creada-dialogo',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButton, MatIcon, TranslatePipe],
  templateUrl: './meta-creada-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './meta-creada-dialogo.css',
})
export class MetaCreadaDialogo {}
