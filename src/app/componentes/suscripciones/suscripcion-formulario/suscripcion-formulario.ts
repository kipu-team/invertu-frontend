import {
  Component,
  ElementRef,
  inject,
  OnInit,
  output,
  signal,
  viewChild,
  ChangeDetectionStrategy,
  computed,
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
import { ConfirmarDialogo } from '../../compartidos/confirmar-dialogo/confirmar-dialogo';

/* US-29: el mismo panel sirve para editar (Figuras 49 y 51).*/
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

  // US-29: id de la suscripción que se está editando (null = registrando una nueva)
  idEditando = signal<number | null>(null);
  editando = computed(() => this.idEditando() !== null);

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

  // despues: lo que se hace luego de guardar bien (por ejemplo, abrir otra suscripción para editar)
  guardar(despues?: () => void): void {
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
    const id = this.idEditando();
    const peticion =
      id === null
        ? this.suscripcionService.registrar(datos)
        : this.suscripcionService.editar(id, datos);

    peticion.subscribe(() => {
      this.guardando.set(false);
      this.limpiar();
      this.guardada.emit();
      if (id === null) {
        this.mostrarMensaje(
          'exito',
          'suscripciones.mensajes.registradaTitulo',
          'suscripciones.mensajes.registradaTexto',
          'suscripciones.mensajes.continuar',
        );
      } else {
        this.mostrarMensaje(
          'exito',
          'suscripciones.mensajes.editadaTitulo',
          'suscripciones.mensajes.editadaTexto',
          'suscripciones.mensajes.continuar',
        );
      }
      despues?.();
    });
  }

  // US-29: carga los datos de una suscripción en el formulario. Si había cambios sin guardar, pregunta primero
  editar(id: number): void {
    if (this.formulario.dirty) {
      this.confirmarCambios(() => this.cargarParaEditar(id));
    } else {
      this.cargarParaEditar(id);
    }
  }

  // Botón "Cancelar": si hay cambios sin guardar, pregunta "¿Guardar cambios?" (Figura 51)
  cancelar(): void {
    if (this.formulario.dirty) {
      this.confirmarCambios(() => this.limpiar());
    } else {
      this.limpiar();
    }
  }

  limpiar(): void {
    this.idEditando.set(null);
    this.formulario.reset({ frecuencia: 'MENSUAL' });
  }

  // Lo usa el botón "+ Nueva suscripción" del listado
  enfocar(): void {
    const campo = this.primerCampo()?.nativeElement;
    campo?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    campo?.focus();
  }

  private cargarParaEditar(id: number): void {
    this.suscripcionService.obtenerDetalle(id).subscribe((s) => {
      this.idEditando.set(id);
      // reset deja el formulario "sin cambios", así solo pregunta si el usuario modifica algo
      this.formulario.reset({
        nombreServicio: s.nombreServicio,
        monto: s.monto,
        frecuencia: s.frecuencia,
        proximaFechaCobro: s.proximaFechaCobro,
        descripcion: s.descripcion ?? '',
      });
      this.enfocar();
    });
  }

  // Guardar = guarda y luego sigue; Descartar = olvida los cambios y sigue; cerrar la ventana = no hace nada
  private confirmarCambios(despues: () => void): void {
    this.dialog
      .open(ConfirmarDialogo, {
        data: {
          titulo: 'suscripciones.confirmarCambios.titulo',
          mensaje: 'suscripciones.confirmarCambios.mensaje',
          textoCancelar: 'suscripciones.confirmarCambios.descartar',
          textoConfirmar: 'suscripciones.confirmarCambios.guardar',
        },
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((guardar) => {
        if (guardar === true) {
          this.guardar(despues);
        } else if (guardar === false) {
          this.limpiar();
          despues();
        }
      });
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
