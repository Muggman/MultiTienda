import { Injectable, signal, computed } from '@angular/core';
import { CarritoItem } from '../models/carrito.model';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // Slug de la tienda a la que pertenece el carrito actual
  private currentSlugSignal = signal<string>('');

  // Items en el carrito actual
  readonly itemsSignal = signal<CarritoItem[]>([]);

  // Estado del drawer lateral del carrito
  readonly drawerAbiertoSignal = signal<boolean>(false);

  // Totales reactivos mediante computed signals
  readonly cantidadTotal = computed(() => {
    return this.itemsSignal().reduce((acc, item) => acc + item.cantidad, 0);
  });

  readonly subtotal = computed(() => {
    return this.itemsSignal().reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  });

  readonly total = computed(() => {
    return this.subtotal();
  });

  readonly estaVacio = computed(() => {
    return this.itemsSignal().length === 0;
  });

  /**
   * Carga el carrito correspondiente a la tienda activa desde localStorage
   */
  cargarParaTienda(slug: string): void {
    if (!slug) return;
    this.currentSlugSignal.set(slug);

    if (typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(`tienda_carrito_${slug}`);
      if (raw) {
        const parsed = JSON.parse(raw) as CarritoItem[];
        this.itemsSignal.set(Array.isArray(parsed) ? parsed : []);
      } else {
        this.itemsSignal.set([]);
      }
    } catch (e) {
      console.error('[CarritoService] Error al leer localStorage:', e);
      this.itemsSignal.set([]);
    }
  }

  /**
   * Agrega un producto al carrito o incrementa su cantidad
   */
  agregarProducto(producto: Producto, cantidad: number = 1): void {
    const slug = this.currentSlugSignal();
    const current = [...this.itemsSignal()];
    const index = current.findIndex(i => i.producto.codigo === producto.codigo);

    if (index >= 0) {
      current[index] = {
        ...current[index],
        cantidad: current[index].cantidad + cantidad
      };
    } else {
      current.push({
        producto,
        cantidad: Math.max(1, cantidad)
      });
    }

    this.itemsSignal.set(current);
    this.guardarEnStorage(slug, current);
    this.abrirDrawer();
  }

  /**
   * Incrementa o decrementa la cantidad de un ítem
   */
  modificarCantidad(codigo: string, delta: number): void {
    const slug = this.currentSlugSignal();
    const current = [...this.itemsSignal()];
    const index = current.findIndex(i => i.producto.codigo === codigo);

    if (index >= 0) {
      const nuevaCantidad = current[index].cantidad + delta;
      if (nuevaCantidad > 0) {
        current[index] = {
          ...current[index],
          cantidad: nuevaCantidad
        };
        this.itemsSignal.set(current);
        this.guardarEnStorage(slug, current);
      } else {
        this.eliminarItem(codigo);
      }
    }
  }

  /**
   * Establece un número exacto de cantidad
   */
  fijarCantidad(codigo: string, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarItem(codigo);
      return;
    }

    const slug = this.currentSlugSignal();
    const current = [...this.itemsSignal()];
    const index = current.findIndex(i => i.producto.codigo === codigo);

    if (index >= 0) {
      current[index] = {
        ...current[index],
        cantidad: Math.floor(cantidad)
      };
      this.itemsSignal.set(current);
      this.guardarEnStorage(slug, current);
    }
  }

  /**
   * Elimina un producto por su código
   */
  eliminarItem(codigo: string): void {
    const slug = this.currentSlugSignal();
    const filtered = this.itemsSignal().filter(i => i.producto.codigo !== codigo);
    this.itemsSignal.set(filtered);
    this.guardarEnStorage(slug, filtered);
  }

  /**
   * Vacía el carrito de la tienda actual
   */
  vaciarCarrito(): void {
    const slug = this.currentSlugSignal();
    this.itemsSignal.set([]);
    this.guardarEnStorage(slug, []);
  }

  // Controles del Drawer lateral
  abrirDrawer(): void {
    this.drawerAbiertoSignal.set(true);
  }

  cerrarDrawer(): void {
    this.drawerAbiertoSignal.set(false);
  }

  toggleDrawer(): void {
    this.drawerAbiertoSignal.update(v => !v);
  }

  private guardarEnStorage(slug: string, items: CarritoItem[]): void {
    if (!slug || typeof window === 'undefined') return;
    try {
      localStorage.setItem(`tienda_carrito_${slug}`, JSON.stringify(items));
    } catch (e) {
      console.error('[CarritoService] Error al persistir en localStorage:', e);
    }
  }
}
