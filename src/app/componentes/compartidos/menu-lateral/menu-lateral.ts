import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SesionService } from '../../../servicios/sesion-service';

interface OpcionMenu {
  ruta: string;
  icono: string;
  texto: string; // clave de traducción
  soloPremium?: boolean;
}

@Component({
  selector: 'app-menu-lateral',
  imports: [RouterLink, RouterLinkActive, MatIcon, TranslatePipe],
  templateUrl: './menu-lateral.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './menu-lateral.css',
})
export class MenuLateral {
  sesion = inject(SesionService);

  // "Deudas" de los mockups NO va: quedó fuera del alcance.
  opciones: OpcionMenu[] = [
    { ruta: '/inicio', icono: 'home', texto: 'compartido.menu.inicio' },
    { ruta: '/movimientos', icono: 'swap_horiz', texto: 'compartido.menu.movimientos' },
    { ruta: '/metas', icono: 'savings', texto: 'compartido.menu.metas' },
    { ruta: '/suscripciones', icono: 'autorenew', texto: 'compartido.menu.suscripciones' },
    {
      ruta: '/calendario',
      icono: 'calendar_month',
      texto: 'compartido.menu.calendario',
      soloPremium: true,
    },
  ];
}
