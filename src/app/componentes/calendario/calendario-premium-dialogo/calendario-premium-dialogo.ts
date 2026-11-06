import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendario-premium-dialogo',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './calendario-premium-dialogo.html',
  styleUrl: './calendario-premium-dialogo.css'
})
export class CalendarioPremiumDialogo {
  private ref = inject(MatDialogRef<CalendarioPremiumDialogo>);
  private router = inject(Router);

  irAPagar(): void {
    this.ref.close();
    void this.router.navigate(['/pasar-premium']);
  }

  salirABase(): void {
    this.ref.close();
    void this.router.navigate(['/inicio']);
  }
}
