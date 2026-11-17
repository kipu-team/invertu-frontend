import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PerfilService } from '../../../servicios/perfil-service';
import { SesionService } from '../../../servicios/sesion-service';

/** Fila de la comparación: qué tiene cada plan (true/false o una clave de texto, ej. "Hasta 3") */
interface Caracteristica {
  clave: string;
  free: boolean | string;
  premium: boolean | string;
}

/**
 * US-39: pasar a Premium en versión de prueba (Figura 98).
 * Comparación Free vs Premium con los límites y precios del backend (tabla plan):
 * Free S/ 0.00 con hasta 3 metas activas y 3 recordatorios; Premium S/ 9.90 sin límites.
 * El pago es simulado: no se cobra nada. El backend cambia el rol a ROLE_PREMIUM
 * y devuelve un token nuevo (cuando se conecte la API en el Sprint 4, hay que guardarlo).
 */
@Component({
  selector: 'app-pasar-premium',
  imports: [TranslatePipe, RouterLink, MatButton, MatIcon],
  templateUrl: './pasar-premium.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pasar-premium.css',
})
export class PasarPremium {
  private perfilService = inject(PerfilService);
  sesion = inject(SesionService);

  cargando = false;
  activado = false; // true justo después de activar la prueba
  errorClave = '';

  /** Solo funciones que existen hoy en InvertU (los "solo Premium" tienen @PreAuthorize en el backend) */
  readonly caracteristicas: Caracteristica[] = [
    { clave: 'movimientos', free: true, premium: true },
    { clave: 'dashboard', free: true, premium: true },
    { clave: 'suscripciones', free: true, premium: true },
    { clave: 'metas', free: 'premium.pasar.limites.hasta3', premium: 'premium.pasar.limites.sinLimite' },
    { clave: 'recordatorios', free: 'premium.pasar.limites.hasta3', premium: 'premium.pasar.limites.sinLimite' },
    { clave: 'fechaEstimada', free: false, premium: true },
    { clave: 'calendario', free: false, premium: true },
    { clave: 'comprobante', free: false, premium: true },
    { clave: 'categorias', free: false, premium: true },
    { clave: 'alertaSaldo', free: false, premium: true },
    { clave: 'chatbot', free: false, premium: true },
  ];

  /** Para el HTML: saber si el valor es un texto (límite) o un sí/no */
  esTexto(valor: boolean | string): valor is string {
    return typeof valor === 'string';
  }

  activarPrueba(): void {
    this.cargando = true;
    this.errorClave = '';
    this.perfilService.pasarPremium().subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.sesion.cambiarRol(respuesta.rol);
        this.activado = true;
      },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;
        // 400: "Ya cuentas con el plan Premium"
        this.errorClave =
          err.status === 400 ? 'premium.pasar.errores.yaPremium' : 'premium.pasar.errores.servidor';
      },
    });
  }
}
