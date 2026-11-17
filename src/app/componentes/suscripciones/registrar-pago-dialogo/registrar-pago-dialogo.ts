import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SuscripcionService } from '../../../servicios/suscripcion-service';
import { MovimientoService } from '../../../servicios/movimiento-service';
import { CategoriaService } from '../../../servicios/categoria-service';
import { Categoria } from '../../../modelo/categoria';
import { MedioPago } from '../../../modelo/comun';

/**
 * Registrar el pago de una suscripción (Figuras 52, 54 y 55). Responsable: Luz. US-28.
 * En el backend un pago es un movimiento GASTO con idSuscripcion (POST /api/v1/movimientos).
 * Se precarga con el monto de la suscripción y la categoría del último pago.
 * Devuelve true si se registró.
 */
@Component({
  selector: 'app-registrar-pago-dialogo',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './registrar-pago-dialogo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './registrar-pago-dialogo.css',
})
export class RegistrarPagoDialogo implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<RegistrarPagoDialogo, boolean>>(MatDialogRef);
  private suscripcionService = inject(SuscripcionService);
  private movimientoService = inject(MovimientoService);
  private categoriaService = inject(CategoriaService);
  private translate = inject(TranslateService);
  private idSuscripcion = inject<number>(MAT_DIALOG_DATA);

  readonly mediosPago: MedioPago[] = [
    'EFECTIVO',
    'TRANSFERENCIA',
    'TARJETA_DEBITO',
    'TARJETA_CREDITO',
    'BILLETERA_DIGITAL',
    'OTRO',
  ];

  hoy = new Date().toLocaleDateString('en-CA');
  nombreServicio = signal('');
  categorias = signal<Categoria[]>([]);
  guardando = signal(false);

  // Las mismas reglas que valida el backend para un movimiento (MovimientoRequestDTO)
  formulario = this.fb.group({
    monto: [null as number | null, [Validators.required, Validators.min(0.01)]],
    fecha: [
      this.hoy,
      [
        Validators.required,
        (control: AbstractControl) => (control.value > this.hoy ? { fechaFutura: true } : null),
      ],
    ],
    idCategoria: [null as number | null, Validators.required],
    medioPago: [null as MedioPago | null],
  });

  ngOnInit(): void {
    this.categoriaService.listar().subscribe((lista) => {
      this.categorias.set(lista);
      // Precarga del detalle: monto y categoría del pago más reciente (o "Suscripciones")
      this.suscripcionService.obtenerDetalle(this.idSuscripcion).subscribe((s) => {
        this.nombreServicio.set(s.nombreServicio);
        const porDefecto = lista.find((c) => c.nombre === 'Suscripciones')?.idCategoria ?? null;
        this.formulario.patchValue({
          monto: s.monto,
          idCategoria: s.ultimaCategoria?.idCategoria ?? porDefecto,
        });
      });
    });
  }

  tieneError(campo: string): boolean {
    const control = this.formulario.get(campo)!;
    return control.invalid && control.touched;
  }

  registrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const v = this.formulario.getRawValue();
    this.guardando.set(true);
    this.movimientoService
      .registrar({
        tipo: 'GASTO',
        clasificacion: 'FIJO',
        descripcion: this.translate.instant('suscripciones.pago.descripcion', {
          nombre: this.nombreServicio(),
        }),
        fecha: v.fecha!,
        monto: v.monto!,
        idCategoria: v.idCategoria!,
        medioPago: v.medioPago,
        idSuscripcion: this.idSuscripcion,
      })
      .subscribe(() => this.dialogRef.close(true));
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
