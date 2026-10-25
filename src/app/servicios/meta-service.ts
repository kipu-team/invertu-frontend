import { Service, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Mensaje } from '../modelo/comun';
import {
  EstadoLimite,
  ExtenderFechaRequest,
  Meta,
  MetaDetalle,
  MetaRequest,
  MetaResumen,
  Proyeccion,
} from '../modelo/meta';
import { SesionService } from './sesion-service';
import { APORTES, METAS, fechaRelativa, siguienteId } from './datos-prueba/datos-prueba';

/** Metas de ahorro (backend: /api/v1/metas). Los aportes están en aporte-service.ts. Por ahora con datos de prueba. */
@Service()
export class MetaService {
  private sesion: SesionService = inject(SesionService);

  crear(datos: MetaRequest): Observable<Meta> {
    const nueva: MetaDetalle = {
      idMeta: siguienteId(METAS, 'idMeta'),
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? null,
      montoObjetivo: datos.montoObjetivo,
      montoAportado: 0,
      porcentaje: 0,
      fechaObjetivo: datos.fechaObjetivo,
      frecuenciaAporte: datos.frecuenciaAporte,
      proximaFechaAporte: null,
      estado: 'ACTIVA',
      vencida: false,
    };
    METAS.push(nueva);
    APORTES[nueva.idMeta] = [];
    return of(this.aMeta(nueva));
  }

  /** Antes de "Nueva meta": el plan Free tiene máximo 2 metas activas (Figura 67). */
  consultarEstadoLimite(): Observable<EstadoLimite> {
    const premium = this.sesion.esPremium();
    const metasActivas = METAS.filter((m) => m.estado === 'ACTIVA').length;
    const limite = premium ? null : 2;
    return of({
      rol: premium ? 'ROLE_PREMIUM' : 'ROLE_FREE',
      metasActivas,
      limite,
      limiteAlcanzado: limite !== null && metasActivas >= limite,
    });
  }

  listarActivas(): Observable<MetaResumen[]> {
    return of(METAS.filter((m) => m.estado === 'ACTIVA').map((m) => this.aResumen(m)));
  }

  /** Metas cumplidas y canceladas */
  listarFinalizadas(): Observable<MetaResumen[]> {
    return of(METAS.filter((m) => m.estado !== 'ACTIVA').map((m) => this.aResumen(m)));
  }

  obtenerDetalle(id: number): Observable<MetaDetalle> {
    return of({ ...METAS.find((m) => m.idMeta === id)! });
  }

  /** Solo Premium (Free → proyección bloqueada, Figura 75) */
  obtenerProyeccion(id: number): Observable<Proyeccion> {
    return of({
      fechaEstimada: fechaRelativa(120),
      mensaje: 'Si mantienes tu ritmo de aportes, cumplirás tu meta antes de la fecha límite',
    });
  }

  actualizar(id: number, datos: MetaRequest): Observable<Meta> {
    const meta = METAS.find((m) => m.idMeta === id)!;
    Object.assign(meta, { ...datos, descripcion: datos.descripcion ?? null });
    meta.porcentaje = Math.round((meta.montoAportado / meta.montoObjetivo) * 100);
    return of(this.aMeta(meta));
  }

  extenderFecha(id: number, datos: ExtenderFechaRequest): Observable<Meta> {
    const meta = METAS.find((m) => m.idMeta === id)!;
    meta.fechaObjetivo = datos.nuevaFechaObjetivo;
    meta.vencida = false;
    return of(this.aMeta(meta));
  }

  cancelar(id: number): Observable<Meta> {
    const meta = METAS.find((m) => m.idMeta === id)!;
    meta.estado = 'CANCELADA';
    return of(this.aMeta(meta));
  }

  reactivar(id: number): Observable<Meta> {
    const meta = METAS.find((m) => m.idMeta === id)!;
    meta.estado = 'ACTIVA';
    return of(this.aMeta(meta));
  }

  eliminar(id: number): Observable<Mensaje> {
    const i = METAS.findIndex((m) => m.idMeta === id);
    if (i >= 0) METAS.splice(i, 1);
    return of({ mensaje: 'Meta eliminada' });
  }

  private aMeta(m: MetaDetalle): Meta {
    return {
      idMeta: m.idMeta,
      nombre: m.nombre,
      montoObjetivo: m.montoObjetivo,
      montoAportado: m.montoAportado,
      fechaObjetivo: m.fechaObjetivo,
      estado: m.estado,
    };
  }

  private aResumen(m: MetaDetalle): MetaResumen {
    return {
      idMeta: m.idMeta,
      nombre: m.nombre,
      montoObjetivo: m.montoObjetivo,
      montoAportado: m.montoAportado,
      porcentaje: m.porcentaje,
      fechaObjetivo: m.fechaObjetivo,
      vencida: m.vencida,
      estado: m.estado,
      fechaCumplimiento: m.estado === 'CUMPLIDA' ? m.fechaObjetivo : null,
    };
  }
}
