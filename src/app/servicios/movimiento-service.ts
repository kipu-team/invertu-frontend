import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Mensaje } from '../modelo/comun';
import {
  AnalisisComprobante,
  FiltrosMovimiento,
  Movimiento,
  MovimientoDetalle,
  MovimientoItem,
  MovimientoLista,
  MovimientoRequest,
} from '../modelo/movimiento';
import { CATEGORIAS, MOVIMIENTOS, fechaRelativa, siguienteId } from './datos-prueba/datos-prueba';

/** Movimientos (backend: /api/v1/movimientos). Por ahora con datos de prueba. */
@Service()
export class MovimientoService {
  registrar(datos: MovimientoRequest): Observable<Movimiento> {
    const nuevo = this.aItem(siguienteId(MOVIMIENTOS, 'idMovimiento'), datos);
    MOVIMIENTOS.push(nuevo);
    return of(this.aMovimiento(nuevo));
  }

  /** Historial del mes, con búsqueda y filtros opcionales. */
  listar(filtros: FiltrosMovimiento): Observable<MovimientoLista> {
    const texto = filtros.busqueda?.toLowerCase() ?? '';
    const nombreCategoria = CATEGORIAS.find((c) => c.idCategoria === filtros.idCategoria)?.nombre;
    const lista = MOVIMIENTOS.filter(
      (m) =>
        !texto ||
        m.descripcion.toLowerCase().includes(texto) ||
        m.categoria.toLowerCase().includes(texto),
    )
      .filter((m) => !filtros.tipo || m.tipo === filtros.tipo)
      .filter((m) => !filtros.clasificacion || m.clasificacion === filtros.clasificacion)
      .filter((m) => !filtros.medioPago || m.medioPago === filtros.medioPago)
      .filter((m) => !filtros.idCategoria || m.categoria === nombreCategoria)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
    return of({ total: lista.length, movimientos: lista });
  }

  obtenerDetalle(id: number): Observable<MovimientoDetalle> {
    const m = MOVIMIENTOS.find((x) => x.idMovimiento === id)!;
    return of({
      idMovimiento: m.idMovimiento,
      tipo: m.tipo,
      clasificacion: m.clasificacion,
      descripcion: m.descripcion,
      fecha: m.fecha,
      monto: m.monto,
      categoria: m.categoria,
      medioPago: m.medioPago,
      suscripcion: m.suscripcion,
      urlComprobante: m.tieneComprobante ? 'https://placehold.co/400x600?text=Comprobante' : null,
    });
  }

  actualizar(id: number, datos: MovimientoRequest): Observable<Movimiento> {
    const i = MOVIMIENTOS.findIndex((x) => x.idMovimiento === id);
    MOVIMIENTOS[i] = this.aItem(id, datos);
    return of(this.aMovimiento(MOVIMIENTOS[i]));
  }

  eliminar(id: number): Observable<Mensaje> {
    const i = MOVIMIENTOS.findIndex((x) => x.idMovimiento === id);
    if (i >= 0) MOVIMIENTOS.splice(i, 1);
    return of({ mensaje: 'Movimiento eliminado' });
  }

  /** Registro con IA (solo Premium): devuelve los datos "leídos" del comprobante. */
  analizarComprobante(archivo: File): Observable<AnalisisComprobante> {
    return of({
      comprobanteRef: 'comprobante-prueba-001',
      datos: {
        monto: 32.5,
        fecha: fechaRelativa(0),
        descripcion: 'Compra en supermercado',
        tipoSugerido: 'GASTO',
      },
    });
  }

  // Convierte los datos del formulario en una fila del historial
  private aItem(id: number, d: MovimientoRequest): MovimientoItem {
    return {
      idMovimiento: id,
      fecha: d.fecha,
      descripcion: d.descripcion,
      categoria: CATEGORIAS.find((c) => c.idCategoria === d.idCategoria)?.nombre ?? '—',
      tipo: d.tipo,
      clasificacion: d.clasificacion,
      monto: d.monto,
      medioPago: d.medioPago ?? null,
      suscripcion: null,
      tieneComprobante: !!d.comprobanteRef,
    };
  }

  private aMovimiento(m: MovimientoItem): Movimiento {
    return {
      idMovimiento: m.idMovimiento,
      tipo: m.tipo,
      descripcion: m.descripcion,
      fecha: m.fecha,
      monto: m.monto,
      categoria: m.categoria,
      suscripcion: m.suscripcion,
      tieneComprobante: m.tieneComprobante,
    };
  }
}
