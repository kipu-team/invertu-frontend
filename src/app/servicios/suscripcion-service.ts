import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EstadoSuscripcion, FrecuenciaSuscripcion } from '../modelo/comun';
import {
  AlertaSaldo,
  AlertaSaldoRequest,
  ReactivarSuscripcionRequest,
  Recordatorio,
  RecordatorioRequest,
  Suscripcion,
  SuscripcionDetalle,
  SuscripcionRequest,
  SuscripcionResumen,
} from '../modelo/suscripcion';
import { SUSCRIPCIONES, siguienteId } from './datos-prueba/datos-prueba';

/** Suscripciones (backend: /api/v1/suscripciones). Por ahora con datos de prueba. */
@Service()
export class SuscripcionService {
  registrar(datos: SuscripcionRequest): Observable<Suscripcion> {
    const nueva: SuscripcionDetalle = {
      idSuscripcion: siguienteId(SUSCRIPCIONES, 'idSuscripcion'),
      nombreServicio: datos.nombreServicio,
      descripcion: datos.descripcion ?? null,
      monto: datos.monto,
      frecuencia: datos.frecuencia,
      proximaFechaCobro: datos.proximaFechaCobro,
      estado: 'ACTIVA',
      recordatorioActivo: false,
      diasAnticipacion: null,
      alertaSaldoActiva: false,
      pagoSinRegistrar: false,
      ultimaCategoria: null,
      pagos: [],
    };
    SUSCRIPCIONES.push(nueva);
    return of(this.aSuscripcion(nueva));
  }

  listarFrecuencias(): Observable<FrecuenciaSuscripcion[]> {
    return of(['SEMANAL', 'MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL']);
  }

  /** Sin estado = todas. */
  listar(estado?: EstadoSuscripcion): Observable<SuscripcionResumen[]> {
    return of(
      SUSCRIPCIONES.filter((s) => !estado || s.estado === estado).map((s) => ({
        idSuscripcion: s.idSuscripcion,
        nombreServicio: s.nombreServicio,
        monto: s.monto,
        frecuencia: s.frecuencia,
        proximaFechaCobro: s.proximaFechaCobro,
        estado: s.estado,
        recordatorioActivo: s.recordatorioActivo,
        pagoSinRegistrar: s.pagoSinRegistrar,
      })),
    );
  }

  obtenerDetalle(id: number): Observable<SuscripcionDetalle> {
    return of({ ...SUSCRIPCIONES.find((s) => s.idSuscripcion === id)! });
  }

  editar(id: number, datos: SuscripcionRequest): Observable<Suscripcion> {
    const s = this.buscar(id);
    Object.assign(s, { ...datos, descripcion: datos.descripcion ?? null });
    return of(this.aSuscripcion(s));
  }

  cancelar(id: number): Observable<Suscripcion> {
    const s = this.buscar(id);
    s.estado = 'CANCELADA';
    return of(this.aSuscripcion(s));
  }

  reactivar(id: number, datos: ReactivarSuscripcionRequest): Observable<Suscripcion> {
    const s = this.buscar(id);
    s.estado = 'ACTIVA';
    s.proximaFechaCobro = datos.proximaFechaCobro;
    return of(this.aSuscripcion(s));
  }

  configurarRecordatorio(id: number, datos: RecordatorioRequest): Observable<Recordatorio> {
    const s = this.buscar(id);
    s.recordatorioActivo = datos.activo;
    s.diasAnticipacion = datos.activo ? (datos.diasAnticipacion ?? 1) : null;
    return of({
      idSuscripcion: id,
      recordatorioActivo: s.recordatorioActivo,
      diasAnticipacion: s.diasAnticipacion,
    });
  }

  /** Solo Premium (Free → aviso, Figura 65) */
  configurarAlertaSaldo(id: number, datos: AlertaSaldoRequest): Observable<AlertaSaldo> {
    const s = this.buscar(id);
    s.alertaSaldoActiva = datos.activa;
    return of({ idSuscripcion: id, alertaSaldoActiva: s.alertaSaldoActiva });
  }

  private buscar(id: number): SuscripcionDetalle {
    return SUSCRIPCIONES.find((s) => s.idSuscripcion === id)!;
  }

  private aSuscripcion(s: SuscripcionDetalle): Suscripcion {
    const ahora = new Date().toISOString();
    return {
      idSuscripcion: s.idSuscripcion,
      nombreServicio: s.nombreServicio,
      descripcion: s.descripcion,
      monto: s.monto,
      frecuencia: s.frecuencia,
      proximaFechaCobro: s.proximaFechaCobro,
      recordatorioActivo: s.recordatorioActivo,
      diasAnticipacion: s.diasAnticipacion,
      ultimaFechaRecordatorio: null,
      alertaSaldoActiva: s.alertaSaldoActiva,
      ultimaFechaAlertaSaldo: null,
      estado: s.estado,
      fechaCancelacion: s.estado === 'CANCELADA' ? ahora.slice(0, 10) : null,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    };
  }
}
