/** GET /categorias */
export interface Categoria {
  idCategoria: number;
  nombre: string;
  personalizada: boolean; // true = creada por el estudiante (se puede eliminar)
}

/** POST /categorias (Premium) */
export interface CategoriaRequest {
  nombre: string;
}
