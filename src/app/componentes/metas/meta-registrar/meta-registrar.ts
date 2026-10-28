import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-meta-registrar',
  imports: [ReactiveFormsModule, TranslatePipe, MatButton],
  templateUrl: './meta-registrar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './meta-registrar.css',
})
export class MetaRegistrar {
  private fb = inject(FormBuilder);

  formulario = this.fb.group({
    nombre: ['', Validators.required],
    montoObjetivo: [null as number | null, [Validators.required, Validators.min(1)]],
    fechaObjetivo: ['', Validators.required],
    frecuenciaAporte: ['SEMANAL', Validators.required],
    descripcion: [''],
  });
}
