import { Component, ChangeDetectionStrategy, EventEmitter, Output, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MovimientoService } from '../../../servicios/movimiento-service';
import { AnalisisComprobante } from '../../../modelo/movimiento';
import { RegistroManual } from '../registro-manual/registro-manual';

// Reglas del comprobante
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'application/pdf'];
const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5 MB en bytes

@Component({
  selector: 'app-registro-ia',
  imports: [TranslatePipe, MatButton, MatIconButton, MatIcon, MatProgressSpinner, RegistroManual],
  templateUrl: './registro-ia.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './registro-ia.css',
})
export class RegistroIa {
  @Output() volver = new EventEmitter<void>();
  @Output() irManual = new EventEmitter<void>();
  @Output() registrado = new EventEmitter<void>();

  private movimientoService = inject(MovimientoService);

  estado: 'carga' | 'analizando' | 'formulario' = 'carga';
  error: 'archivo' | 'ilegible' | null = null;
  archivo: File | null = null;
  analisis: AnalisisComprobante | null = null;
  private yaRegistrado = false;

  elegirArchivo(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';
    if (!archivo) return;

    if (!TIPOS_PERMITIDOS.includes(archivo.type) || archivo.size > TAMANO_MAXIMO) {
      this.error = 'archivo';
      return;
    }

    this.error = null;
    this.archivo = archivo;
    this.estado = 'analizando';
    this.movimientoService.analizarComprobante(archivo).subscribe({
      next: (data) => {
        this.analisis = data;
        this.estado = 'formulario';
      },
      // Si la IA no puede leerlo, el backend responde con error
      error: () => {
        this.error = 'ilegible';
        this.estado = 'carga';
      },
    });
  }

  reiniciar(): void {
    this.estado = 'carga';
    this.error = null;
    this.archivo = null;
    this.analisis = null;
    this.yaRegistrado = false;
  }

  alRegistrar(): void {
    this.yaRegistrado = true;
    this.registrado.emit(); // la página recarga la tabla
  }

  alVolver(): void {
    if (this.yaRegistrado) {
      this.volver.emit();
    } else {
      this.reiniciar();
    }
  }
}
