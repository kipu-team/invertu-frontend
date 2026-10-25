import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateMultiHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { IdiomaService } from './servicios/idioma-service';

/*
 * Textos ES/EN: un par de archivos por sección en public/i18n/<seccion>/es.json y en.json.
 * Así cada integrante edita solo los de su sección y no hay conflictos en GitHub.
 * Si creas una sección nueva, agrégala a esta lista.
 */
const SECCIONES_I18N = [
  'compartido',
  'autenticacion',
  'inicio',
  'chatbot',
  'movimientos',
  'categorias',
  'metas',
  'suscripciones',
  'calendario',
  'perfil',
  'premium',
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // zone.js: la pantalla se actualiza sola al llegar datos con .subscribe() (como en los ejemplos del profe)
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Por ahora solo se usa para cargar los textos ES/EN. Más adelante también para la API.
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'es',
      loader: provideTranslateMultiHttpLoader({
        resources: SECCIONES_I18N.map((seccion) => `./i18n/${seccion}/`),
      }),
    }),
    provideAppInitializer(() => inject(IdiomaService).iniciar()),
  ],
};
