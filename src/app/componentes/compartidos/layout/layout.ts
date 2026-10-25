import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuLateral } from '../menu-lateral/menu-lateral';
import { Cabecera } from '../cabecera/cabecera';

/** Estructura común de las pantallas con sesión: menú lateral + cabecera + contenido. */
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, MenuLateral, Cabecera],
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './layout.css',
})
export class Layout {}
