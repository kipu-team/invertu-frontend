/** GET /inicio/orientacion */
export interface Orientacion {
  nombreEstudiante: string;
  movimientoRegistrado: boolean;
  metaRegistrada: boolean;
  mostrarOrientacion: boolean;
}

/** GET /inicio/indicadores?anio=&mes= */
export interface Indicadores {
  ingresos: number;
  ingresosFijos: number;
  ingresosVariables: number;
  gastos: number;
  gastosFijos: number;
  gastosVariables: number;
  aportesMetas: number;
  disponible: number;
  ahorroTotal: number;
}

export interface SemanaGrafico {
  semana: number;
  ingresos: number;
  gastos: number;
}

export interface TotalCategoria {
  categoria: string;
  total: number;
}

/** GET /inicio/graficos?anio=&mes= */
export interface Graficos {
  evolucionSemanal: SemanaGrafico[];
  gastosPorCategoria: TotalCategoria[];
  ingresosPorFuente: TotalCategoria[];
}
