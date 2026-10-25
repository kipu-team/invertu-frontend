import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<router-outlet />',
})
export class App {
  constructor() {
    // Íconos: <mat-icon>home</mat-icon> usa "Material Symbols" (https://fonts.google.com/icons)
    inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
  }
}
