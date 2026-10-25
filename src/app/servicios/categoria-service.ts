import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Categoria, CategoriaRequest } from '../modelo/categoria';
import { Mensaje } from '../modelo/comun';
import { CATEGORIAS, siguienteId } from './datos-prueba/datos-prueba';

/** Categorías (backend: /api/v1/categorias). Crear y eliminar son solo Premium. Por ahora con datos de prueba. */
@Service()
export class CategoriaService {
  listar(): Observable<Categoria[]> {
    return of([...CATEGORIAS]);
  }

  crear(datos: CategoriaRequest): Observable<Categoria> {
    const nueva: Categoria = {
      idCategoria: siguienteId(CATEGORIAS, 'idCategoria'),
      nombre: datos.nombre.trim(),
      personalizada: true,
    };
    CATEGORIAS.push(nueva);
    return of(nueva);
  }

  /** "Eliminar" una categoría personalizada (el backend la desactiva). */
  desactivar(id: number): Observable<Mensaje> {
    const i = CATEGORIAS.findIndex((c) => c.idCategoria === id && c.personalizada);
    if (i >= 0) CATEGORIAS.splice(i, 1);
    return of({ mensaje: 'Categoría eliminada' });
  }
}
