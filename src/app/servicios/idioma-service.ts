import { Service, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export type CodigoIdioma = 'es' | 'en';

/**
 * Cambia el idioma de toda la app (ES/EN) y lo recuerda en localStorage.
 * Los textos están en public/i18n/<seccion>/es.json y en.json.
 */
@Service()
export class IdiomaService {
  private translate = inject(TranslateService);
  readonly actual = signal<CodigoIdioma>('es');

  /** Se llama una vez al arrancar la app (app.config.ts). */
  iniciar(): Observable<unknown> {
    const guardado = localStorage.getItem('idioma');
    return this.cargar(guardado === 'en' ? 'en' : 'es');
  }

  usar(idioma: CodigoIdioma): void {
    this.cargar(idioma).subscribe();
  }

  private cargar(idioma: CodigoIdioma): Observable<unknown> {
    const carga = this.translate.use(idioma);
    this.actual.set(idioma);
    localStorage.setItem('idioma', idioma);
    document.documentElement.lang = idioma;
    return carga;
  }

  alternar(): void {
    this.usar(this.actual() === 'es' ? 'en' : 'es');
  }

  /** El backend guarda el idioma como 'es_419' o 'en_US' (PUT /perfil/preferencias). */
  aFormatoBackend(): 'es_419' | 'en_US' {
    return this.actual() === 'es' ? 'es_419' : 'en_US';
  }
}
