import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Panel verde de la derecha (58% en el Figma). Es igual en todas las pantallas de autenticación:
 * iniciar sesión, registro, recuperar y restablecer contraseña.
 *
 * Uso dentro de <div class="pagina">:  <app-panel-autenticacion />
 *
 * El mini-dashboard es solo decorativo: los montos son fijos, como en el mockup.
 */
@Component({
  selector: 'app-panel-autenticacion',
  imports: [MatIcon, TranslatePipe],
  templateUrl: './panel-autenticacion.html',
  styleUrl: './panel-autenticacion.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PanelAutenticacion {
  // Montos de ejemplo del mini-dashboard (no vienen del backend)
  readonly balanceTotal = 'S/ 45,200';
  readonly gastado = 'S/ 3,450';
  readonly montoFijo = 'S/ 8,000';
  readonly montoVariable = 'S/ 4,200';

  // Los 3 beneficios de abajo: ícono de Material Symbols + clave de texto
  readonly beneficios = [
    { icono: 'account_balance_wallet', texto: 'autenticacion.panel.beneficios.gastos' },
    { icono: 'workspace_premium', texto: 'autenticacion.panel.beneficios.metas' },
    { icono: 'trending_up', texto: 'autenticacion.panel.beneficios.libertad' },
  ];
}
