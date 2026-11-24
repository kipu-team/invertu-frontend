import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { PerfilService } from '../../../servicios/perfil-service';
import { IdiomaService } from '../../../servicios/idioma-service';
import { Idioma, Tema } from '../../../modelo/comun';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

interface Notificaciones {
  alertasGastos: boolean;
  recordatoriosMetas: boolean;
  actualizacionesSistema: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-preferencias',
  standalone: true,
  imports: [
    MatIconModule,
    TranslatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  styleUrl: './preferencias.css',
  templateUrl: './preferencias.html',
})
export class Preferencias implements OnInit {
  private perfilService = inject(PerfilService);
  private idiomaService = inject(IdiomaService);

  tema = signal<Tema>('SISTEMA');
  idioma = signal<Idioma>('es_419');

  notificaciones = signal<Notificaciones>({
    alertasGastos: true,
    recordatoriosMetas: true,
    actualizacionesSistema: false
  });

  ngOnInit() {
    this.perfilService.obtener().subscribe({
      next: (perfil) => {
        this.tema.set(perfil.tema);
        this.idioma.set(perfil.idioma);
        this.aplicarTema(perfil.tema);
        this.idiomaService.usar(perfil.idioma === 'en_US' ? 'en' : 'es');
      }
    });

    const guardado = localStorage.getItem('notificaciones');
    if (guardado) {
      try {
        const datos = JSON.parse(guardado) as Notificaciones;
        this.notificaciones.set({
          alertasGastos: datos.alertasGastos ?? true,
          recordatoriosMetas: datos.recordatoriosMetas ?? true,
          actualizacionesSistema: datos.actualizacionesSistema ?? false
        });
      } catch {
        localStorage.removeItem('notificaciones');
      }
    }
  }

  cambiarTema(tema: Tema): void {
    this.tema.set(tema);
    this.aplicarTema(tema);
    this.guardarPreferencias();
  }

  cambiarIdioma(idioma: Idioma): void {
    this.idioma.set(idioma);
    this.idiomaService.usar(idioma === 'en_US' ? 'en' : 'es');
    this.guardarPreferencias();
  }

  cambiarNotificacion(campo: keyof Notificaciones, valor: boolean): void {
    const actual = this.notificaciones();
    const nuevas = { ...actual, [campo]: valor };
    this.notificaciones.set(nuevas);
    localStorage.setItem('notificaciones', JSON.stringify(nuevas));
  }

  restaurarConfiguracion(): void {
    this.tema.set('SISTEMA');
    this.idioma.set('es_419');
    this.notificaciones.set({ alertasGastos: true, recordatoriosMetas: true, actualizacionesSistema: false });
    this.aplicarTema('SISTEMA');
    this.idiomaService.usar('es');
    this.guardarPreferencias();
  }

  restaurarTema(): void {
    this.tema.set('SISTEMA');
    this.aplicarTema('SISTEMA');
    this.guardarPreferencias();
  }

  private guardarPreferencias(): void {
    this.perfilService.actualizarPreferencias({ tema: this.tema(), idioma: this.idioma() }).subscribe();
  }

  private aplicarTema(tema: Tema): void {
    const oscuro = tema === 'OSCURO' || (tema === 'SISTEMA' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const overlayContainer = document.querySelector('.cdk-overlay-container');

    if (oscuro) {
      htmlElement.classList.add('oscuro-theme');
      bodyElement.classList.add('oscuro-theme');
      overlayContainer?.classList.add('oscuro-theme');
    } else {
      htmlElement.classList.remove('oscuro-theme');
      bodyElement.classList.remove('oscuro-theme');
      overlayContainer?.classList.remove('oscuro-theme');
    }
  }
}
