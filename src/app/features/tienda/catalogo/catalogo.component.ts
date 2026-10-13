import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../core/models/producto.model';
import { TiendaConfig } from '../../../core/models/tienda.model';
import { ProductosService } from '../../../core/services/productos.service';
import { ProductoCardComponent } from './producto-card.component';

type OrdenPrecio = 'default' | 'precio-asc' | 'precio-desc' | 'nombre-asc';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ProductoCardComponent],
  template: `
    <section class="my-8">
      <!-- Barra de Filtros por Categoría y Orden -->
      <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <!-- Pestañas de categorías con scroll horizontal -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            type="button"
            (click)="seleccionarCategoria('todas')"
            [class.text-white]="categoriaActiva() === 'todas'"
            [class.font-bold]="categoriaActiva() === 'todas'"
            [class.shadow-xs]="categoriaActiva() === 'todas'"
            [class.bg-slate-100]="categoriaActiva() !== 'todas'"
            [class.text-slate-600]="categoriaActiva() !== 'todas'"
            [style.backgroundColor]="categoriaActiva() === 'todas' ? tienda().colores.primario : ''"
            class="px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer hover:opacity-90"
          >
            Todas ({{ productos().length }})
          </button>

          @for (cat of categorias(); track cat) {
            <button
              type="button"
              (click)="seleccionarCategoria(cat)"
              [class.text-white]="categoriaActiva() === cat"
              [class.font-bold]="categoriaActiva() === cat"
              [class.shadow-xs]="categoriaActiva() === cat"
              [class.bg-slate-100]="categoriaActiva() !== cat"
              [class.text-slate-600]="categoriaActiva() !== cat"
              [style.backgroundColor]="categoriaActiva() === cat ? tienda().colores.primario : ''"
              class="px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer hover:opacity-90"
            >
              {{ cat }}
            </button>
          }
        </div>

        <!-- Selector de ordenamiento -->
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs text-slate-500 font-medium">Ordenar:</span>
          <select
            [value]="ordenActual()"
            (change)="onOrdenChange($event)"
            class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 cursor-pointer"
          >
            <option value="default">Recomendados</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
            <option value="nombre-asc">Nombre (A-Z)</option>
          </select>
        </div>
      </div>

      <!-- Estado de Carga -->
      @if (cargando()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-12">
          @for (n of [1,2,3,4,5,6,7,8]; track n) {
            <div class="rounded-2xl border border-slate-200 bg-white p-4 animate-pulse space-y-4">
              <div class="aspect-square bg-slate-100 rounded-xl"></div>
              <div class="h-4 bg-slate-100 rounded w-3/4"></div>
              <div class="h-3 bg-slate-100 rounded w-1/2"></div>
              <div class="pt-4 flex justify-between">
                <div class="h-5 bg-slate-100 rounded w-1/3"></div>
                <div class="h-8 bg-slate-100 rounded-xl w-1/4"></div>
              </div>
            </div>
          }
        </div>
      } @else if (productosFiltrados().length === 0) {
        <!-- Estado sin resultados -->
        <div class="text-center py-16 px-4 rounded-3xl border border-slate-200 bg-white">
          <div class="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-base font-bold text-slate-800 mb-1">No se encontraron productos</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            No hay productos que coincidan con "{{ textoBusqueda() }}" en la categoría seleccionada.
          </p>
          <button
            type="button"
            (click)="limpiarFiltros()"
            class="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      } @else {
        <!-- Grilla de Productos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          @for (prod of productosFiltrados(); track prod.codigo) {
            <app-producto-card
              [producto]="prod"
              [tienda]="tienda()"
            ></app-producto-card>
          }
        </div>
      }
    </section>
  `
})
export class CatalogoComponent implements OnInit {
  tienda = input.required<TiendaConfig>();
  textoBusqueda = input<string>('');

  private readonly productosService = inject(ProductosService);

  productos = signal<Producto[]>([]);
  categorias = signal<string[]>([]);
  categoriaActiva = signal<string>('todas');
  ordenActual = signal<OrdenPrecio>('default');
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  async cargarCatalogo(): Promise<void> {
    this.cargando.set(true);
    const hoja = this.tienda().hojaExcel || this.tienda().slug;
    const prods = await this.productosService.obtenerProductosPorHoja(hoja);
    this.productos.set(prods);
    this.categorias.set(this.productosService.obtenerCategorias(prods));
    this.cargando.set(false);
  }

  seleccionarCategoria(cat: string): void {
    this.categoriaActiva.set(cat);
  }

  onOrdenChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as OrdenPrecio;
    this.ordenActual.set(value);
  }

  limpiarFiltros(): void {
    this.categoriaActiva.set('todas');
  }

  readonly productosFiltrados = computed(() => {
    let prods = [...this.productos()];
    const cat = this.categoriaActiva();
    const query = this.textoBusqueda().toLowerCase().trim();

    // 1. Filtrar por categoría
    if (cat !== 'todas') {
      prods = prods.filter(p => p.categoria === cat);
    }

    // 2. Filtrar por texto
    if (query) {
      prods = prods.filter(p =>
        p.nombre.toLowerCase().includes(query) ||
        p.descripcion.toLowerCase().includes(query) ||
        p.codigo.toLowerCase().includes(query) ||
        p.categoria.toLowerCase().includes(query)
      );
    }

    // 3. Ordenamiento
    const orden = this.ordenActual();
    if (orden === 'precio-asc') {
      prods.sort((a, b) => a.precio - b.precio);
    } else if (orden === 'precio-desc') {
      prods.sort((a, b) => b.precio - a.precio);
    } else if (orden === 'nombre-asc') {
      prods.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return prods;
  });
}
