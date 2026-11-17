import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Graficos, Indicadores, Orientacion, TotalCategoria } from '../modelo/inicio';
import { APORTES, METAS, MOVIMIENTOS, PERFIL } from './datos-prueba/datos-prueba';

/**
 * Dashboard de Inicio (backend: /api/v1/inicio). Por ahora con datos de prueba.
 * Igual que el backend, indicadores y gráficos se calculan solo con lo del mes consultado.
 */
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
    const ingresos = this.sumar(anio, mes, 'INGRESO');
    const gastos = this.sumar(anio, mes, 'GASTO');
    const aportesMetas = Object.values(APORTES)
      .flat()
      .filter((a) => this.esDelMes(a.fecha, anio, mes))
      .reduce((total, a) => total + a.monto, 0);
    return of({
      ingresos,
      ingresosFijos: this.sumar(anio, mes, 'INGRESO', 'FIJO'),
      ingresosVariables: this.sumar(anio, mes, 'INGRESO', 'VARIABLE'),
      gastos,
      gastosFijos: this.sumar(anio, mes, 'GASTO', 'FIJO'),
      gastosVariables: this.sumar(anio, mes, 'GASTO', 'VARIABLE'),
      aportesMetas,
      disponible: Math.round((ingresos - gastos - aportesMetas) * 100) / 100,
      ahorroTotal: METAS.reduce((total, m) => total + m.montoAportado, 0),
    });
  }

  obtenerGraficos(anio: number, mes: number): Observable<Graficos> {
    return of({
      evolucionSemanal: this.agruparPorSemana(anio, mes),
      gastosPorCategoria: this.agruparPorCategoria(anio, mes, 'GASTO'),
      ingresosPorFuente: this.agruparPorCategoria(anio, mes, 'INGRESO'),
    });
  }

  /** fecha 'YYYY-MM-DD' */
  private esDelMes(fecha: string, anio: number, mes: number): boolean {
    return fecha.startsWith(`${anio}-${String(mes).padStart(2, '0')}`);
  }

  private delMes(anio: number, mes: number, tipo: string) {
    return MOVIMIENTOS.filter((m) => m.tipo === tipo && this.esDelMes(m.fecha, anio, mes));
  }

  private sumar(anio: number, mes: number, tipo: string, clasificacion?: string): number {
    return this.delMes(anio, mes, tipo)
      .filter((m) => !clasificacion || m.clasificacion === clasificacion)
      .reduce((total, m) => total + m.monto, 0);
  }

  private agruparPorCategoria(anio: number, mes: number, tipo: string): TotalCategoria[] {
    const totales: Record<string, number> = {};
    this.delMes(anio, mes, tipo).forEach((m) => {
      totales[m.categoria] = (totales[m.categoria] ?? 0) + m.monto;
    });
    // Igual que el backend: de mayor a menor
    return Object.entries(totales)
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total);
  }

  /** Igual que el backend: semana 1 = días 1-7, semana 2 = días 8-14, ..., semana 5 = días 29-31 */
  private agruparPorSemana(anio: number, mes: number) {
    const diasDelMes = new Date(anio, mes, 0).getDate();
    const semanas = Array.from({ length: Math.ceil(diasDelMes / 7) }, (_, i) => ({
      semana: i + 1,
      ingresos: 0,
      gastos: 0,
    }));
    MOVIMIENTOS.filter((m) => this.esDelMes(m.fecha, anio, mes)).forEach((m) => {
      const s = semanas[Math.floor((Number(m.fecha.slice(8, 10)) - 1) / 7)];
      if (m.tipo === 'INGRESO') s.ingresos += m.monto;
      else s.gastos += m.monto;
    });
    return semanas;
  }
}
