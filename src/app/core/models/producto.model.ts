/**
 * Modelo de datos de Producto según especificación del Excel:
 * columnas: codigo, nombre, descripcion, categoria, precio, imagen
 */
export interface Producto {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagen?: string;
}

export interface CategoriaFiltro {
  nombre: string;
  cantidad: number;
}
