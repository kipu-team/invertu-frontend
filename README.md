# InvertU — Frontend (Angular 22)

App web de finanzas personales para estudiantes universitarios. Este repositorio es **solo el frontend**; el backend (Spring Boot) está en `invertu-backend`.

## Cómo correrlo

Requisitos: **Node.js 24 LTS** (o 22.22.3 en adelante) y Angular CLI 22 (`npm install -g @angular/cli@22`).

```bash
npm install
npm start       # abre http://localhost:4200
```

Por ahora **no se conecta al backend**: los servicios devuelven datos de prueba.

## Estructura

```
src/
├── app/
│   ├── componentes/     → una carpeta por sección
│   │   ├── compartidos/    menú lateral, cabecera, ventana de confirmación
│   │   ├── autenticacion/  iniciar-sesion, registro, recuperar y restablecer contraseña
│   │   ├── inicio/         inicio (dashboard)
│   │   ├── chatbot/        chatbot-flotante (dentro de Inicio)
│   │   ├── movimientos/    movimientos (historial + paneles laterales)
│   │   ├── categorias/     selector-categorias, categoria-nueva-dialogo
│   │   ├── metas/          metas-listar, meta-registrar, meta-detalle
│   │   ├── suscripciones/  suscripciones
│   │   ├── calendario/     calendario
│   │   ├── perfil/         perfil
│   │   └── premium/        pasar-premium, aviso-premium-dialogo
│   ├── modelo/          → interfaces con los mismos campos que los DTOs del backend
│   ├── servicios/       → un servicio por controller del backend
│   └── app.routes.ts    → rutas de la app
├── styles.css           → estilos y colores generales
└── custom-theme.scss    → tema de Angular Material
public/i18n/<seccion>/   → textos en español (es.json) e inglés (en.json)
```

## Equipo

Reparto, reglas de trabajo y guía para contribuir: ver [CONTRIBUTING.md](CONTRIBUTING.md).
