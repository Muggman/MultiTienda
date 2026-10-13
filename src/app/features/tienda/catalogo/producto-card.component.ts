import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../core/models/producto.model';
import { TiendaConfig } from '../../../core/models/tienda.model';
import { CarritoService } from '../../../core/services/carrito.service';
import { PrecioPipe } from '../../../shared/pipes/precio.pipe';

@Component({
  selector: 'app-producto-card',
  standalone: true,
  imports: [CommonModule, PrecioPipe],
  template: `
    <div
      class="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300"
    >
      <!-- Contenedor de Imagen -->
      <div class="relative aspect-square w-full overflow-hidden bg-slate-100">
        @if (producto().imagen) {
          <img
            [src]="producto().imagen"
            [alt]="producto().nombre"
            loading="lazy"
            (error)="onImageError($event)"
            class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        } @else {
          <!-- Fallback visual minimalista -->
          <div class="flex h-full w-full flex-col items-center justify-center p-4 text-center text-slate-400">
            <svg class="h-12 w-12 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-xs">{{ producto().categoria }}</span>
          </div>
        }

        <!-- Badge de categoría -->
        <span class="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-2xs border border-slate-200/50">
          {{ producto().categoria }}
        </span>

        <!-- Código de producto -->
        <span class="absolute top-3 right-3 rounded-md bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 text-[10px] font-mono font-medium text-white">
          {{ producto().codigo }}
        </span>
      </div>

      <!-- Información del Producto -->
      <div class="flex flex-1 flex-col p-5">
        <h3 class="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-theme-primary transition-colors">
          {{ producto().nombre }}
        </h3>

        <p class="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {{ producto().descripcion }}
        </p>

        <!-- Precio y botón Agregar -->
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Precio</span>
            <span class="text-lg font-black tracking-tight text-slate-900">
              {{ producto().precio | precio: tienda().locale: tienda().moneda }}
            </span>
          </div>

          <button
            type="button"
            (click)="agregarAlCarrito()"
            [disabled]="agregadoReciente()"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-90"
            [style.backgroundColor]="agregadoReciente() ? '#10b981' : tienda().colores.primario"
          >
            @if (agregadoReciente()) {
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>¡Listo!</span>
            } @else {
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Agregar</span>
            }
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductoCardComponent {
  producto = input.required<Producto>();
  tienda = input.required<TiendaConfig>();

  private readonly carritoService = inject(CarritoService);
  agregadoReciente = signal<boolean>(false);

  agregarAlCarrito(): void {
    this.carritoService.agregarProducto(this.producto(), 1);
    this.agregadoReciente.set(true);

    setTimeout(() => {
      this.agregadoReciente.set(false);
    }, 1200);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80';
  }
}
