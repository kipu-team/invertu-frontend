import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { CategoriaService } from '../../../servicios/categoria-service';

@Component({
  selector: 'app-categoria-nueva-dialogo',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './categoria-nueva-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './categoria-nueva-dialogo.css',
})
export class CategoriaNuevaDialogo {
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private ref = inject(MatDialogRef<CategoriaNuevaDialogo>);
  private existentes: string[] = [];

  formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
  });

  get nombre() {
    return this.formulario.controls.nombre;
  }

  constructor() {
    this.categoriaService.listar().subscribe((data) => {
      this.existentes = data.map((c) => c.nombre.toLowerCase());
    });
  }

  crear(): void {
    const texto = (this.nombre.value ?? '').trim();
    if (!texto) {
      this.nombre.setErrors({ required: true });
    } else if (this.existentes.includes(texto.toLowerCase())) {
      this.nombre.setErrors({ duplicada: true });
    }
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.categoriaService.crear({ nombre: texto }).subscribe((nueva) => {
      this.ref.close(nueva); // la devuelve a SelectorCategorias
    });
  }
}
