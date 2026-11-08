import {
  Component,
  ElementRef,
  inject,
  OnInit,
  output,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SuscripcionService } from '../../../servicios/suscripcion-service';
import { FrecuenciaSuscripcion } from '../../../modelo/comun';
import { SuscripcionRequest } from '../../../modelo/suscripcion';
import { SuscripcionMensajeDialogo } from '../suscripcion-mensaje-dialogo/suscripcion-mensaje-dialogo';

@Component({
  selector: 'app-suscripcion-formulario',
  imports: [ReactiveFormsModule, MatButton, MatIcon, TranslatePipe],
  templateUrl: './suscripcion-formulario.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './suscripcion-formulario.css',
})
export class SuscripcionFormulario implements OnInit {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private suscripcionService = inject(SuscripcionService);

  guardada = output<void>();

  hoy = new Date().toLocaleDateString('en-CA'); // fecha de hoy en formato AAAA-MM-DD
  frecuencias = signal<FrecuenciaSuscripcion[]>([]);
  guardando = signal(false);

  private primerCampo = viewChild<ElementRef<HTMLInputElement>>('primerCampo');

  // Las mismas reglas que valida el backend (SuscripcionRequestDTO)
  formulario = this.fb.group({
    nombreServicio: ['', [Validators.required, Validators.maxLength(100)]],
    monto: [null as number | null, [Validators.required, Validators.min(0.01)]],
    frecuencia: ['MENSUAL' as FrecuenciaSuscripcion, Validators.required],
    proximaFechaCobro: [
      '',
      [
        Validators.required,
        (control: AbstractControl) =>
          control.value && control.value < this.hoy ? { fechaPasada: true } : null,
      ],
    ],
    descripcion: ['', Validators.maxLength(500)],
  });

  ngOnInit(): void {
    this.suscripcionService.listarFrecuencias().subscribe((data) => this.frecuencias.set(data));
  }

  // Muestra el error de un campo solo después de que el usuario lo tocó
  tieneError(campo: string): boolean {
    const control = this.formulario.get(campo)!;
    return control.invalid && control.touched;
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched(); // pinta en rojo los campos que faltan (Figura 57)
      if (this.formulario.controls.proximaFechaCobro.hasError('fechaPasada')) {
        this.mostrarMensaje(
          'error',
          'suscripciones.mensajes.errorTitulo',
          'suscripciones.formulario.errores.fechaPasada',
          'suscripciones.mensajes.reintentar',
        );
      }
      return;
    }

    const valores = this.formulario.getRawValue();
    const datos: SuscripcionRequest = {
      nombreServicio: valores.nombreServicio!.trim(),
      monto: valores.monto!,
      frecuencia: valores.frecuencia!,
      proximaFechaCobro: valores.proximaFechaCobro!,
      descripcion: valores.descripcion?.trim() || undefined,
    };

    this.guardando.set(true);
    this.suscripcionService.registrar(datos).subscribe(() => {
      this.guardando.set(false);
      this.limpiar();
      this.guardada.emit();
      this.mostrarMensaje(
        'exito',
        'suscripciones.mensajes.registradaTitulo',
        'suscripciones.mensajes.registradaTexto',
        'suscripciones.mensajes.continuar',
      );
    });
  }

  limpiar(): void {
    this.formulario.reset({ frecuencia: 'MENSUAL' });
  }

  // Lo usa el botón "+ Nueva suscripción" del listado
  enfocar(): void {
    const campo = this.primerCampo()?.nativeElement;
    campo?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    campo?.focus();
  }

  private mostrarMensaje(
    tipo: 'exito' | 'error',
    titulo: string,
    mensaje: string,
    boton: string,
  ): void {
    this.dialog.open(SuscripcionMensajeDialogo, {
      data: { tipo, titulo, mensaje, boton },
      width: '420px',
      maxWidth: '95vw',
    });
  }
}
