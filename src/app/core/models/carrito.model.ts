import { Producto } from './producto.model';

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

export interface CarritoResumen {
  items: CarritoItem[];
  cantidadTotal: number;
  subtotal: number;
  total: number;
}
