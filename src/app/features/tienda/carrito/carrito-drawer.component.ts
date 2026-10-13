import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../../core/services/carrito.service';
import { TiendaConfig } from '../../../core/models/tienda.model';
import { PrecioPipe } from '../../../shared/pipes/precio.pipe';

@Component({
  selector: 'app-carrito-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink, PrecioPipe],
  template: `
    @if (carritoService.drawerAbiertoSignal()) {
      <div class="fixed inset-0 z-50 overflow-hidden">
        <!-- Backdrop -->
        <div
          (click)="carritoService.cerrarDrawer()"
          class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
        ></div>

        <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div
            class="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between transform transition-transform duration-300"
          >
            <!-- Cabecera del Drawer -->
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="h-9 w-9 rounded-xl flex items-center justify-center text-white"
                  [style.backgroundColor]="tienda().colores.primario"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-base font-bold text-slate-900">Carrito de Compras</h2>
                  <p class="text-xs text-slate-500">
                    {{ carritoService.cantidadTotal() }} {{ carritoService.cantidadTotal() === 1 ? 'producto' : 'productos' }}
                  </p>
                </div>
              </div>

              <button
                type="button"
                (click)="carritoService.cerrarDrawer()"
                class="rounded-lg p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Cerrar carrito"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Contenido / Lista de Productos -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
              @if (carritoService.estaVacio()) {
                <div class="h-full flex flex-col items-center justify-center text-center py-12">
                  <div class="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 class="text-base font-bold text-slate-800 mb-1">Tu carrito está vacío</h3>
                  <p class="text-xs text-slate-500 max-w-xs mb-6">
                    Explorá el catálogo de {{ tienda().nombre }} y seleccioná tus productos favoritos.
                  </p>
                  <button
                    type="button"
                    (click)="carritoService.cerrarDrawer()"
                    class="px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-opacity"
                    [style.backgroundColor]="tienda().colores.primario"
                  >
                    Ver Catálogo
                  </button>
                </div>
              } @else {
                @for (item of carritoService.itemsSignal(); track item.producto.codigo) {
                  <div class="flex items-start gap-4 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                    <!-- Miniatura imagen -->
                    <div class="h-16 w-16 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                      @if (item.producto.imagen) {
                        <img
                          [src]="item.producto.imagen"
                          [alt]="item.producto.nombre"
                          class="h-full w-full object-cover"
                        />
                      } @else {
                        <div class="h-full w-full flex items-center justify-center text-slate-400 text-xs">
                          Img
                        </div>
                      }
                    </div>

                    <!-- Datos y Controles -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2">
                        <h4 class="text-xs font-bold text-slate-900 truncate">
                          {{ item.producto.nombre }}
                        </h4>
                        <button
                          type="button"
                          (click)="carritoService.eliminarItem(item.producto.codigo)"
                          class="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar del carrito"
                        >
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <span class="text-[11px] font-mono text-slate-500 block mb-2">
                        {{ item.producto.codigo }}
                      </span>

                      <div class="flex items-center justify-between">
                        <!-- Stepper de cantidad -->
                        <div class="flex items-center rounded-lg border border-slate-200 bg-white">
                          <button
                            type="button"
                            (click)="carritoService.modificarCantidad(item.producto.codigo, -1)"
                            class="h-7 w-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-l-lg transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span class="w-8 text-center text-xs font-bold text-slate-800">
                            {{ item.cantidad }}
                          </span>
                          <button
                            type="button"
                            (click)="carritoService.modificarCantidad(item.producto.codigo, 1)"
                            class="h-7 w-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-r-lg transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <!-- Subtotal del producto -->
                        <span class="text-xs font-bold text-slate-900">
                          {{ (item.producto.precio * item.cantidad) | precio: tienda().locale: tienda().moneda }}
                        </span>
                      </div>
                    </div>
                  </div>
                }
              }
            </div>

            <!-- Footer del Drawer con Totales y Checkout -->
            @if (!carritoService.estaVacio()) {
              <div class="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                <div class="space-y-1.5 text-xs">
                  <div class="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>{{ carritoService.subtotal() | precio: tienda().locale: tienda().moneda }}</span>
                  </div>
                  <div class="flex justify-between text-slate-500">
                    <span>Envío</span>
                    <span class="text-emerald-600 font-medium">A coordinar / Bonificado</span>
                  </div>
                  <div class="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                    <span>Total</span>
                    <span [style.color]="tienda().colores.primario">
                      {{ carritoService.total() | precio: tienda().locale: tienda().moneda }}
                    </span>
                  </div>
                </div>

                <div class="space-y-2">
                  <button
                    type="button"
                    (click)="irAlCheckout()"
                    class="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-md transition-all hover:opacity-95 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                    [style.backgroundColor]="tienda().colores.primario"
                  >
                    <span>Confirmar Carrito</span>
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>

                  <div class="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      (click)="carritoService.vaciarCarrito()"
                      class="text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Vaciar carrito
                    </button>
                    <a
                      [routerLink]="['/', tienda().slug, 'carrito']"
                      (click)="carritoService.cerrarDrawer()"
                      class="text-slate-600 hover:text-slate-900 hover:underline"
                    >
                      Ver página completa
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class CarritoDrawerComponent {
  tienda = input.required<TiendaConfig>();

  readonly carritoService = inject(CarritoService);
  private readonly router = inject(Router);

  irAlCheckout(): void {
    this.carritoService.cerrarDrawer();
    this.router.navigate(['/', this.tienda().slug, 'checkout']);
  }
}
