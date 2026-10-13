import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../../core/services/carrito.service';
import { ConfigService } from '../../../core/services/config.service';
import { PrecioPipe } from '../../../shared/pipes/precio.pipe';

@Component({
  selector: 'app-carrito-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PrecioPipe],
  template: `
    @if (tienda(); as t) {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <!-- Breadcrumb & Título -->
        <nav class="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <a [routerLink]="['/', t.slug]" class="hover:text-slate-800 transition-colors">{{ t.nombre }}</a>
          <span>/</span>
          <span class="text-slate-800 font-semibold">Carrito de Compras</span>
        </nav>

        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Carrito de Compras
            </h1>
            <p class="text-sm text-slate-500 mt-1">
              Revisá tus productos seleccionados antes de confirmar tu pedido o solicitar presupuesto.
            </p>
          </div>

          @if (!carritoService.estaVacio()) {
            <button
              type="button"
              (click)="carritoService.vaciarCarrito()"
              class="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
            >
              Vaciar carrito completo
            </button>
          }
        </div>

        @if (carritoService.estaVacio()) {
          <!-- Estado Vacío -->
          <div class="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto shadow-xs my-8">
            <div class="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-slate-800 mb-2">Tu carrito está vacío</h2>
            <p class="text-sm text-slate-500 mb-6">
              Aún no agregaste productos de {{ t.nombre }}. Explorá el catálogo y descubrí todas las opciones disponibles.
            </p>
            <a
              [routerLink]="['/', t.slug]"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all hover:opacity-95"
              [style.backgroundColor]="t.colores.primario"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Volver a la tienda</span>
            </a>
          </div>
        } @else {
          <!-- Grilla de Carrito + Resumen -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Lista de Productos -->
            <div class="lg:col-span-8 rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div class="divide-y divide-slate-100">
                @for (item of carritoService.itemsSignal(); track item.producto.codigo) {
                  <div class="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <!-- Imagen -->
                    <div class="h-24 w-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                      @if (item.producto.imagen) {
                        <img
                          [src]="item.producto.imagen"
                          [alt]="item.producto.nombre"
                          class="h-full w-full object-cover"
                        />
                      } @else {
                        <div class="h-full w-full flex items-center justify-center text-slate-400 text-xs">
                          Sin imagen
                        </div>
                      }
                    </div>

                    <!-- Datos del producto -->
                    <div class="flex-1 text-center sm:text-left">
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <h3 class="text-base font-bold text-slate-900">
                          {{ item.producto.nombre }}
                        </h3>
                        <span class="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {{ item.producto.codigo }}
                        </span>
                      </div>

                      <p class="text-xs text-slate-500 mt-1 line-clamp-1">
                        {{ item.producto.descripcion }}
                      </p>

                      <div class="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
                        <!-- Stepper -->
                        <div class="flex items-center gap-3">
                          <span class="text-xs text-slate-500">Cantidad:</span>
                          <div class="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                            <button
                              type="button"
                              (click)="carritoService.modificarCantidad(item.producto.codigo, -1)"
                              class="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-l-xl transition-colors cursor-pointer text-sm font-bold"
                            >
                              -
                            </button>
                            <span class="w-10 text-center text-xs font-bold text-slate-900">
                              {{ item.cantidad }}
                            </span>
                            <button
                              type="button"
                              (click)="carritoService.modificarCantidad(item.producto.codigo, 1)"
                              class="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-r-xl transition-colors cursor-pointer text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <!-- Precio unitario y total -->
                        <div class="text-right">
                          <span class="text-xs text-slate-400 block">
                            {{ item.producto.precio | precio: t.locale: t.moneda }} c/u
                          </span>
                          <span class="text-base font-bold text-slate-900">
                            {{ (item.producto.precio * item.cantidad) | precio: t.locale: t.moneda }}
                          </span>
                        </div>

                        <!-- Botón eliminar -->
                        <button
                          type="button"
                          (click)="carritoService.eliminarItem(item.producto.codigo)"
                          class="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Eliminar producto"
                        >
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Columna Resumen de Orden -->
            <div class="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              <h2 class="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                Resumen del Pedido
              </h2>

              <div class="space-y-3 text-sm">
                <div class="flex justify-between text-slate-600">
                  <span>Productos ({{ carritoService.cantidadTotal() }})</span>
                  <span class="font-medium text-slate-900">
                    {{ carritoService.subtotal() | precio: t.locale: t.moneda }}
                  </span>
                </div>
                <div class="flex justify-between text-slate-600">
                  <span>Logística / Envíos</span>
                  <span class="text-emerald-700 font-medium">A convenir</span>
                </div>
                <div class="pt-3 border-t border-slate-200 flex justify-between text-lg font-extrabold text-slate-900">
                  <span>Total Final</span>
                  <span [style.color]="t.colores.primario">
                    {{ carritoService.total() | precio: t.locale: t.moneda }}
                  </span>
                </div>
              </div>

              <!-- Tipo de checkout habilitado -->
              <div class="rounded-2xl p-4 bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <span class="font-bold text-slate-800 block">Modo de Confirmación:</span>
                @if (t.modoCheckout === 'presupuesto') {
                  <p>Esta tienda emite cotizaciones formales en formato PDF con validez oficial.</p>
                } @else if (t.modoCheckout === 'venta') {
                  <p>Esta tienda procesa pagos directos en línea con pasarela Mercado Pago.</p>
                } @else {
                  <p>Podés elegir entre solicitar un presupuesto en PDF o comprar online directamente.</p>
                }
              </div>

              <div class="space-y-3">
                <button
                  type="button"
                  (click)="continuarCheckout()"
                  class="w-full py-4 px-6 rounded-2xl font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-base"
                  [style.backgroundColor]="t.colores.primario"
                >
                  <span>Continuar con la Confirmación</span>
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <a
                  [routerLink]="['/', t.slug]"
                  class="block text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2"
                >
                  Seguir agregando productos
                </a>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class CarritoPageComponent {
  private readonly configService = inject(ConfigService);
  private readonly router = inject(Router);
  readonly carritoService = inject(CarritoService);

  readonly tienda = this.configService.tiendaActivaSignal;

  continuarCheckout(): void {
    const t = this.tienda();
    if (t) {
      this.router.navigate(['/', t.slug, 'checkout']);
    }
  }
}
