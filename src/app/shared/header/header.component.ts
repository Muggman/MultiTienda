import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TiendaConfig } from '../../core/models/tienda.model';
import { CarritoService } from '../../core/services/carrito.service';
import { ConfigService } from '../../core/services/config.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors shadow-xs"
      [style.backgroundColor]="'rgba(255, 255, 255, 0.95)'"
      [style.borderColor]="'rgba(0, 0, 0, 0.08)'"
    >
      <!-- Barra superior multi-tienda rápida (selector para cambiar de tienda fácilmente) -->
      <div class="border-b text-xs py-1.5 px-4 bg-slate-900 text-slate-300">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
            <span class="font-medium text-slate-200">Plataforma Multi-Tienda</span>
            <span class="text-slate-500 hidden sm:inline">|</span>
            <span class="text-slate-400 hidden sm:inline">Explorá nuestras tiendas:</span>
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto">
            @for (t of configService.tiendasDisponibles(); track t.slug) {
              <a
                [routerLink]="['/', t.slug]"
                [class.bg-white]="t.slug === tienda().slug"
                [class.text-slate-900]="t.slug === tienda().slug"
                [class.font-bold]="t.slug === tienda().slug"
                [class.text-slate-300]="t.slug !== tienda().slug"
                [class.hover:text-white]="t.slug !== tienda().slug"
                class="px-2.5 py-0.5 rounded text-[11px] transition-colors whitespace-nowrap"
              >
                {{ t.nombre }}
              </a>
            }
          </div>
        </div>
      </div>

      <!-- Navegación principal -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20 gap-4">
          <!-- Logo y Marca -->
          <a [routerLink]="['/', tienda().slug]" class="flex items-center gap-3 shrink-0 group">
            @if (tienda().logo) {
              <img
                [src]="tienda().logo"
                [alt]="tienda().nombre"
                class="h-11 w-auto max-w-[200px] object-contain transition-transform group-hover:scale-102"
              />
            } @else {
              <div
                class="h-10 w-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm"
                [style.backgroundColor]="tienda().colores.primario"
              >
                {{ tienda().nombre.charAt(0) }}
              </div>
              <div>
                <span class="font-extrabold text-lg tracking-tight block" [style.color]="tienda().colores.primario">
                  {{ tienda().nombre }}
                </span>
                <span class="text-[11px] font-medium text-slate-500 block -mt-0.5">
                  {{ tienda().rubro }}
                </span>
              </div>
            }
          </a>

          <!-- Buscador central en desktop -->
          <div class="hidden md:flex flex-1 max-w-md mx-4">
            <div class="relative w-full">
              <input
                type="text"
                [value]="terminoBusqueda()"
                (input)="onSearchInput($event)"
                placeholder="Buscar en {{ tienda().nombre }}..."
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-2xs"
                [style.--tw-ring-color]="tienda().colores.secundario"
              />
              <svg
                class="absolute left-3.5 top-3 h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              @if (terminoBusqueda()) {
                <button
                  type="button"
                  (click)="limpiarBusqueda()"
                  class="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full h-5 w-5 flex items-center justify-center"
                >
                  ✕
                </button>
              }
            </div>
          </div>

          <!-- Acciones derecha -->
          <div class="flex items-center gap-3">
            <!-- Botón de WhatsApp rápido -->
            @if (tienda().info.whatsapp) {
              <a
                [href]="'https://wa.me/' + tienda().info.whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                class="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                title="Contactar por WhatsApp"
              >
                <svg class="h-4 w-4 text-emerald-600 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            }

            <!-- Botón del Carrito con contador badge -->
            <button
              type="button"
              (click)="carritoService.abrirDrawer()"
              class="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm transition-all hover:opacity-95 active:scale-95 cursor-pointer"
              [style.backgroundColor]="tienda().colores.primario"
              aria-label="Abrir carrito de compras"
            >
              <div class="relative">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                @if (carritoService.cantidadTotal() > 0) {
                  <span
                    class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-black text-white shadow-xs animate-in zoom-in duration-150"
                    [style.backgroundColor]="tienda().colores.acento"
                  >
                    {{ carritoService.cantidadTotal() }}
                  </span>
                }
              </div>
              <span class="hidden sm:inline">Carrito</span>
            </button>
          </div>
        </div>

        <!-- Buscador móvil debajo de la barra -->
        <div class="pb-3 md:hidden">
          <div class="relative w-full">
            <input
              type="text"
              [value]="terminoBusqueda()"
              (input)="onSearchInput($event)"
              placeholder="Buscar productos..."
              class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:bg-white shadow-2xs"
              [style.--tw-ring-color]="tienda().colores.secundario"
            />
            <svg
              class="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  tienda = input.required<TiendaConfig>();
  buscar = output<string>();

  readonly carritoService = inject(CarritoService);
  readonly configService = inject(ConfigService);

  terminoBusqueda = signal<string>('');

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.terminoBusqueda.set(value);
    this.buscar.emit(value);
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda.set('');
    this.buscar.emit('');
  }
}
