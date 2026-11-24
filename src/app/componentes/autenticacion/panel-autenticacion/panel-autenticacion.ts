import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/*
 * Panel verde de la derecha, común a las 4 pantallas de autenticación
 * Mini-dashboard decorativo: montos fijos, como en el mockup
 */
@Component({
  selector: 'app-panel-autenticacion',
  imports: [MatIcon, TranslatePipe],
  templateUrl: './panel-autenticacion.html',
  styleUrl: './panel-autenticacion.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PanelAutenticacion {
  readonly balanceTotal = 'S/ 45,200';
  readonly gastado = 'S/ 3,450';
  readonly montoFijo = 'S/ 8,000';
  readonly montoVariable = 'S/ 4,200';

  readonly beneficios = [
    { icono: 'account_balance_wallet', texto: 'autenticacion.panel.beneficios.gastos' },
    { icono: 'workspace_premium', texto: 'autenticacion.panel.beneficios.metas' },
    { icono: 'trending_up', texto: 'autenticacion.panel.beneficios.libertad' },
  ];
}
