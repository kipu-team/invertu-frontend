import { Routes } from '@angular/router';
import { Layout } from './componentes/compartidos/layout/layout';

import { IniciarSesion } from './componentes/autenticacion/iniciar-sesion/iniciar-sesion';
import { Registro } from './componentes/autenticacion/registro/registro';
import { RecuperarContrasena } from './componentes/autenticacion/recuperar-contrasena/recuperar-contrasena';
import { RestablecerContrasena } from './componentes/autenticacion/restablecer-contrasena/restablecer-contrasena';
import { Inicio } from './componentes/inicio/inicio/inicio';
import { Movimientos } from './componentes/movimientos/movimientos/movimientos';
import { MetasListar } from './componentes/metas/metas-listar/metas-listar';
import { MetaRegistrar } from './componentes/metas/meta-registrar/meta-registrar';
import { MetaDetalle } from './componentes/metas/meta-detalle/meta-detalle';
import { Suscripciones } from './componentes/suscripciones/suscripciones/suscripciones';
import { Calendario } from './componentes/calendario/calendario/calendario';
import { Perfil } from './componentes/perfil/perfil/perfil';
import { PasarPremium } from './componentes/premium/pasar-premium/pasar-premium';

/*
 * TODAS las rutas de la app. Ya están creadas: nadie debería necesitar editar este archivo.
 * Si de verdad necesitas una ruta nueva, avisa al grupo antes (es el archivo que más conflictos da).
 */
export const routes: Routes = [
  // Sin menú lateral (Mafer)
  { path: 'iniciar-sesion', component: IniciarSesion }, // Figuras 7–8
  { path: 'registro', component: Registro }, // Figuras 14–20
  { path: 'recuperar-contrasena', component: RecuperarContrasena }, // Figuras 9–10
  { path: 'restablecer-contrasena', component: RestablecerContrasena }, // Figuras 11–13 (?token=...)

  // Con menú lateral y cabecera
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: Inicio }, // Figuras 21–23 (Mafer; chatbot: Luz)
      { path: 'movimientos', component: Movimientos }, // Figuras 24–46 (Meme; categorías: Matias)
      { path: 'metas', component: MetasListar }, // Figuras 67, 70–73 (Bruno)
      { path: 'metas/registrar', component: MetaRegistrar }, // Figuras 66, 68–69 (Bruno)
      { path: 'metas/registrar/:id', component: MetaRegistrar }, // Figuras 80–81 (Bruno)
      { path: 'metas/:id', component: MetaDetalle }, // Figuras 74–79, 82–87 (Bruno)
      { path: 'suscripciones', component: Suscripciones }, // Figuras 47–65 (Meme)
      { path: 'calendario', component: Calendario }, // Figuras 88–92 (Mafer)
      { path: 'perfil', component: Perfil }, // Figuras 93–97 (Luz)
      { path: 'pasar-premium', component: PasarPremium }, // Figura 98 (Matias)
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
