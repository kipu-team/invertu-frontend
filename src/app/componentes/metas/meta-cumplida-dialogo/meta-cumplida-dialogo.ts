import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-meta-cumplida-dialogo',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButton, MatIcon, TranslatePipe],
  templateUrl: './meta-cumplida-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './meta-cumplida-dialogo.css',
})
export class MetaCumplidaDialogo {}
