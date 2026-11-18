import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Lista de requisitos de la contraseña: en verde si se cumple, en gris si no (US-01 y US-04).
 *
 * Uso: <app-requisitos-contrasena [contrasena]="formulario.controls.contrasena.value ?? ''" />
 */
@Component({
  selector: 'app-requisitos-contrasena',
  imports: [MatIcon, TranslatePipe],
  templateUrl: './requisitos-contrasena.html',
  styleUrl: './requisitos-contrasena.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class RequisitosContrasena {
  contrasena = input.required<string>();

  readonly requisitos = computed(() => {
    const v = this.contrasena();
    return [
      { clave: 'minimo', ok: v.length >= 8 },
      { clave: 'mayuscula', ok: /[A-Z]/.test(v) },
      { clave: 'minuscula', ok: /[a-z]/.test(v) },
      { clave: 'numero', ok: /\d/.test(v) },
      { clave: 'especial', ok: /[^A-Za-z0-9\s]/.test(v) },
    ];
  });
}
