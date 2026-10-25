# Guía del equipo 
## Cómo correrlo

Requisitos: **Node.js 24 LTS** (o 22.22.3 en adelante) y Angular CLI 22 (`npm install -g @angular/cli@22`).

```bash
npm install
npm start       # abre http://localhost:4200
```

Por ahora **no se conecta al backend**: los servicios devuelven datos de prueba (ver más abajo).

## Reparto

| Integrante | Pantallas | Figuras (informe 3.2.1) |
|---|---|---|
| Milene | movimientos, suscripciones | 24–38, 43–65 |
| Mafer | autenticación, inicio, calendario | 7–22, 88–92 |
| Bruno | metas (listar, registrar/editar, detalle) | 66–87 |
| Luz | chatbot, perfil | 23, 93–97 |
| Matias | selector de categorías, ventanas de categoría y Premium, pasar a Premium, revisar `en.json` | 39–42, 98 |

Cada pantalla muestra un cartel **"En construcción"** con lo que falta. Cuando termines, borra el `<app-en-construccion>` de tu HTML.

## Reglas del equipo

1. **Trabaja solo en tu carpeta** de `componentes/` y en tus archivos de `public/i18n/<tu-seccion>/`.
   Si necesitas un componente más (un panel, una ventana), créalo dentro de tu carpeta:
   `ng g c componentes/metas/aporte-dialogo --skip-tests`
2. **No editar** `app.routes.ts`, `app.config.ts`, `styles.css`, `custom-theme.scss`, `modelo/` ni `servicios/` sin avisar al grupo.
   Si hace falta un dato de prueba, pídelo o agrégalo en `datos-prueba.ts` avisando previamente.
3. **Una rama por pantalla o función**, creada desde `develop`
   (`git checkout -b feature/metas-listar`), y Pull Request a **`develop`**.
   `main` solo recibe cambios desde `develop` cuando una versión está lista para desplegar.
4. **Nada de texto escrito directo en el HTML.** Todo texto va con una clave de traducción:

   ```json
   // public/i18n/metas/es.json
   { "metas": { "nueva": "Nueva meta" } }
   // public/i18n/metas/en.json
   { "metas": { "nueva": "New goal" } }
   ```
   ```html
   <button mat-flat-button>{{ 'metas.nueva' | translate }}</button>
   ```
   Importa `TranslatePipe` en tu componente (`import { TranslatePipe } from '@ngx-translate/core'`).
   Siempre agrega la clave en **los dos** archivos (es y en).
5. **Colores:** usa las variables de `styles.css` (`var(--verde-esmeralda)`, `var(--dorado)`, `var(--gasto)`...), no escribas códigos de color.
   Los estilos de cada pantalla van en su `.css`, con CSS normal.
6. **Usa las piezas de Angular Material** en vez de crearlas desde cero: botones (`mat-flat-button`),
   tablas (`mat-table`), campos de formulario (`mat-form-field`), ventanas (`MatDialog`), pestañas (`mat-tab-group`).
   Ya vienen con los colores de InvertU, y así toda la app se ve igual. Ejemplos en https://material.angular.dev/components

## Datos de prueba

Los servicios (`servicios/`) todavía no llaman al backend: devuelven datos escritos en
`servicios/datos-prueba/datos-prueba.ts`, con **los mismos campos que el backend**.

- Para ver las pantallas Premium: menú del avatar → **"Ver como Premium (prueba)"**.
- Usuario para probar el login: `sofia@correo.com` / `Clave123*` (cualquier otro devuelve error 401).
- Los cambios (registrar, editar, eliminar) se guardan solo en memoria y se reinician al recargar la página.

**Cuando el profe enseñe HTTP:** dentro de cada servicio se cambia el dato de prueba por la llamada a la API
(`this.http.get(...)`). Las pantallas no cambian, porque ya usan `.subscribe()`.

## Servicios y cómo usar un servicio (mismo patrón que el profe)

```ts
export class MetasListar implements OnInit {
  private metaService = inject(MetaService);
  metas: MetaResumen[] = [];

  ngOnInit(): void {
    this.metaService.listarActivas().subscribe(data => this.metas = data);
  }
}
```

## Utilidades compartidas (no crear de nuevo)

Estas piezas ya existen y se ven como en los mockups. Se usarán en las pantallas para que toda la app se vea igual.

### 1. Saber si el usuario es Free o Premium
Para mostrar u ocultar algo según el plan.

En `.ts`:
```ts
sesion = inject(SesionService);
```
En `.html`:
```html
@if (sesion.esPremium()) {
  <!-- lo que ve el usuario Premium -->
} @else {
  <!-- lo que ve el usuario Free -->
}
```
Para probar las dos vistas: menú del avatar → "Ver como Premium (prueba)".

### 2. Ventana "¿Estás seguro?"
Para eliminar, cancelar o cualquier acción que se deba confirmar. Es la misma ventana que aparece al cerrar sesión.
Está en `componentes/compartidos/confirmar-dialogo/`. Ahí mismo hay un ejemplo de cómo abrirla.

### 3. Aviso "Solo Premium"
Cuando un usuario Free toca algo que es solo para Premium (crear categoría, alerta de saldo, proyección...).
Muestra el mensaje y un botón "Pasar a Premium".
```ts
this.dialog.open(AvisoPremiumDialogo);
```

### 4. Botón dorado
El botón amarillo de los mockups (por ejemplo, "+ Nueva meta"):
```html
<button mat-flat-button class="boton-dorado">...</button>
```

### 5. Tarjeta blanca
La caja blanca con bordes redondeados que se repite en los mockups:
```htmln
<div class="tarjeta">...</div>
```

### 6. Íconos
Escribe el nombre del ícono y aparece el dibujo:
```html
<mat-icon>savings</mat-icon>   <!-- alcancía -->
<mat-icon>delete</mat-icon>    <!-- tacho -->
```
Busca los nombres en https://fonts.google.com/icons
