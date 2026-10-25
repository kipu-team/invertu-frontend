import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Graficos, Indicadores, Orientacion, TotalCategoria } from '../modelo/inicio';
import { METAS, MOVIMIENTOS, PERFIL } from './datos-prueba/datos-prueba';

/** Dashboard de Inicio (backend: /api/v1/inicio). Por ahora con datos de prueba. */
@Service()
export class InicioService {
  obtenerOrientacion(): Observable<Orientacion> {
    const movimientoRegistrado = MOVIMIENTOS.length > 0;
    const metaRegistrada = METAS.length > 0;
    return of({
      nombreEstudiante: PERFIL.nombres,
      movimientoRegistrado,
      metaRegistrada,
      mostrarOrientacion: !movimientoRegistrado || !metaRegistrada,
    });
  }

  obtenerIndicadores(anio: number, mes: number): Observable<Indicadores> {
    const ingresos = this.sumar('INGRESO');
    const gastos = this.sumar('GASTO');
    const aportesMetas = 150;
    return of({
      ingresos,
      ingresosFijos: this.sumar('INGRESO', 'FIJO'),
      ingresosVariables: this.sumar('INGRESO', 'VARIABLE'),
      gastos,
      gastosFijos: this.sumar('GASTO', 'FIJO'),
      gastosVariables: this.sumar('GASTO', 'VARIABLE'),
      aportesMetas,
      disponible: Math.round((ingresos - gastos - aportesMetas) * 100) / 100,
      ahorroTotal: METAS.reduce((total, m) => total + m.montoAportado, 0),
    });
  }

  obtenerGraficos(anio: number, mes: number): Observable<Graficos> {
    return of({
      evolucionSemanal: [
        { semana: 1, ingresos: 800, gastos: 14.5 },
        { semana: 2, ingresos: 450, gastos: 59.9 },
        { semana: 3, ingresos: 0, gastos: 65 },
        { semana: 4, ingresos: 0, gastos: 8 },
      ],
      gastosPorCategoria: this.agruparPorCategoria('GASTO'),
      ingresosPorFuente: this.agruparPorCategoria('INGRESO'),
    });
  }

  private sumar(tipo: string, clasificacion?: string): number {
    return MOVIMIENTOS.filter(
      (m) => m.tipo === tipo && (!clasificacion || m.clasificacion === clasificacion),
    ).reduce((total, m) => total + m.monto, 0);
  }

  private agruparPorCategoria(tipo: string): TotalCategoria[] {
    const totales: Record<string, number> = {};
    MOVIMIENTOS.filter((m) => m.tipo === tipo).forEach((m) => {
      totales[m.categoria] = (totales[m.categoria] ?? 0) + m.monto;
    });
    return Object.entries(totales).map(([categoria, total]) => ({ categoria, total }));
  }
}
