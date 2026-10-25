import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

@Component({
  selector: 'app-perfil',
  imports: [EnConstruccion],
  templateUrl: './perfil.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './perfil.css',
})
export class Perfil {
  pendientes = [
    'Pestañas: Perfil (ver y editar, 93–95), Configuración (tema e idioma, 96), Contraseña (97)',
    'La cabecera abre /perfil?pestana=configuracion: abrir esa pestaña',
    "Al cambiar el idioma: llamar también a idiomaService.usar('es' | 'en')",
  ];
}
