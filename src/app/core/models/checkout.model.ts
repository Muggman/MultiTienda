import { CarritoItem } from './carrito.model';

export interface ClienteDatos {
  nombre: string;
  email: string;
  telefono: string;
  observaciones?: string;
  direccionEntrega?: string;
}

export type TipoOperacion = 'presupuesto' | 'venta';

export interface OrdenCheckout {
  id: string;
  numeroPresupuesto?: string;
  fecha: Date;
  tiendaSlug: string;
  tipo: TipoOperacion;
  cliente: ClienteDatos;
  items: CarritoItem[];
  total: number;
  moneda: string;
}
