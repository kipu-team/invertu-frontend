import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Aporte, AporteRequest } from '../modelo/aporte';
import { APORTES, METAS, siguienteId } from './datos-prueba/datos-prueba';

/** Aportes de una meta (backend: /api/v1/metas/{idMeta}/aportes). Por ahora con datos de prueba. */
@Service()
export class AporteService {
  listar(idMeta: number): Observable<Aporte[]> {
    return of([...(APORTES[idMeta] ?? [])]);
  }

  /** Suma el aporte a la meta; si llega al 100 %, la meta pasa a CUMPLIDA (Figura 79). */
  registrar(idMeta: number, datos: AporteRequest): Observable<Aporte> {
    const meta = METAS.find((m) => m.idMeta === idMeta)!;
    meta.montoAportado += datos.monto;
    meta.porcentaje = Math.round((meta.montoAportado / meta.montoObjetivo) * 100);
    if (meta.montoAportado >= meta.montoObjetivo) meta.estado = 'CUMPLIDA';

    const nuevo: Aporte = {
      idAporte: siguienteId(Object.values(APORTES).flat(), 'idAporte'),
      fecha: datos.fecha,
      monto: datos.monto,
      descripcion: datos.descripcion ?? null,
      montoAportado: meta.montoAportado,
      porcentaje: meta.porcentaje,
      estadoMeta: meta.estado,
    };
    (APORTES[idMeta] ??= []).push(nuevo);
    return of(nuevo);
  }

  eliminar(idMeta: number, idAporte: number): Observable<Aporte> {
    const lista = APORTES[idMeta];
    const meta = METAS.find((m) => m.idMeta === idMeta)!;
    const [eliminado] = lista.splice(
      lista.findIndex((a) => a.idAporte === idAporte),
      1,
    );
    meta.montoAportado -= eliminado.monto;
    meta.porcentaje = Math.round((meta.montoAportado / meta.montoObjetivo) * 100);
    if (meta.estado === 'CUMPLIDA' && meta.montoAportado < meta.montoObjetivo)
      meta.estado = 'ACTIVA';
    return of({
      ...eliminado,
      montoAportado: meta.montoAportado,
      porcentaje: meta.porcentaje,
      estadoMeta: meta.estado,
    });
  }
}
