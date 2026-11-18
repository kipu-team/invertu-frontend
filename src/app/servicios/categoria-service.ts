import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, CategoriaRequest } from '../modelo/categoria';
import { Mensaje } from '../modelo/comun';
import { environment } from '../../environments/environment';

/** Categorías (backend: /api/v1/categorias). Crear y desactivar son solo Premium (Free recibe 403). */
@Service()
export class CategoriaService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/categorias`;

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }

  crear(datos: CategoriaRequest): Observable<Categoria> {
    return this.http.post<Categoria>(this.url, datos);
  }

  /** "Eliminar" una categoría personalizada (el backend la desactiva). */
  desactivar(id: number): Observable<Mensaje> {
    return this.http.patch<Mensaje>(`${this.url}/${id}/desactivar`, {});
  }
}
