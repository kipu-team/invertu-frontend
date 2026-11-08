import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateMultiHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { IdiomaService } from './servicios/idioma-service';
import { autenticacionInterceptor } from './servicios/autenticacion-interceptor';

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
    // Textos ES/EN y la API. El interceptor agrega el token a cada petición a la API.
    provideHttpClient(withInterceptors([autenticacionInterceptor])),
    provideTranslateService({
      fallbackLang: 'es',
      loader: provideTranslateMultiHttpLoader({
        resources: SECCIONES_I18N.map((seccion) => `./i18n/${seccion}/`),
      }),
    }),
    provideAppInitializer(() => inject(IdiomaService).iniciar()),
  ],
};
