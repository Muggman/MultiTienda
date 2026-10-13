import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '../../../core/services/config.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { PdfService } from '../../../core/services/pdf.service';
import { ClienteDatos, TipoOperacion } from '../../../core/models/checkout.model';
import { MercadoPagoCarouselComponent } from './mp-carousel.component';
import { PrecioPipe } from '../../../shared/pipes/precio.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MercadoPagoCarouselComponent, PrecioPipe],
  template: `
    @if (tienda(); as t) {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <!-- Breadcrumb -->
        <nav class="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <a [routerLink]="['/', t.slug]" class="hover:text-slate-800 transition-colors">{{ t.nombre }}</a>
          <span>/</span>
          <a [routerLink]="['/', t.slug, 'carrito']" class="hover:text-slate-800 transition-colors">Carrito</a>
          <span>/</span>
          <span class="text-slate-800 font-semibold">Confirmación de Pedido</span>
        </nav>

        @if (carritoService.estaVacio()) {
          <div class="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-md mx-auto shadow-xs">
            <h2 class="text-xl font-bold text-slate-800 mb-2">No hay productos en el carrito</h2>
            <p class="text-sm text-slate-500 mb-6">Agregá productos antes de proceder a la confirmación.</p>
            <a
              [routerLink]="['/', t.slug]"
              class="inline-block px-6 py-3 rounded-xl font-bold text-xs text-white"
              [style.backgroundColor]="t.colores.primario"
            >
              Ir a la tienda
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Formulario de datos y selección de modo -->
            <div class="lg:col-span-7 space-y-6">
              <!-- Selector de Modo si la tienda tiene 'ambos' -->
              @if (t.modoCheckout === 'ambos') {
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Seleccioná cómo querés operar
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      (click)="setTipoOperacion('presupuesto')"
                      [class.border-slate-900]="tipoOperacion() === 'presupuesto'"
                      [class.bg-slate-900]="tipoOperacion() === 'presupuesto'"
                      [class.text-white]="tipoOperacion() === 'presupuesto'"
                      [class.bg-slate-50]="tipoOperacion() !== 'presupuesto'"
                      [class.text-slate-700]="tipoOperacion() !== 'presupuesto'"
                      class="p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3"
                    >
                      <div class="mt-0.5">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <span class="font-bold text-sm block">Solicitar Presupuesto</span>
                        <span class="text-xs opacity-80">Descarga inmediata en PDF con 7 días de validez</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      (click)="setTipoOperacion('venta')"
                      [class.border-sky-500]="tipoOperacion() === 'venta'"
                      [class.bg-[#009ee3]]="tipoOperacion() === 'venta'"
                      [class.text-white]="tipoOperacion() === 'venta'"
                      [class.bg-slate-50]="tipoOperacion() !== 'venta'"
                      [class.text-slate-700]="tipoOperacion() !== 'venta'"
                      class="p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3"
                    >
                      <div class="mt-0.5">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <span class="font-bold text-sm block">Comprar Ahora Online</span>
                        <span class="text-xs opacity-80">Pago directo vía Mercado Pago Checkout</span>
                      </div>
                    </button>
                  </div>
                </div>
              }

              <!-- Datos de Contacto del Cliente -->
              <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                <div class="flex items-center gap-2 mb-6">
                  <div
                    class="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                    [style.backgroundColor]="t.colores.primario"
                  >
                    1
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-slate-900">Datos del Cliente</h2>
                    <p class="text-xs text-slate-500">
                      {{ tipoOperacion() === 'presupuesto' ? 'Requeridos para emitir el presupuesto formal' : 'Requeridos para facturación y envío' }}
                    </p>
                  </div>
                </div>

                <form #formRef="ngForm" (ngSubmit)="procesarConfirmacion()" class="space-y-4">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre completo o Razón Social *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      [(ngModel)]="cliente.nombre"
                      required
                      placeholder="Ej: Mariana López o Empresa S.A."
                      class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:bg-white"
                      [style.--tw-ring-color]="t.colores.secundario"
                    />
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1">
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        name="email"
                        [(ngModel)]="cliente.email"
                        required
                        placeholder="mariana@ejemplo.com"
                        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:bg-white"
                        [style.--tw-ring-color]="t.colores.secundario"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        [(ngModel)]="cliente.telefono"
                        required
                        placeholder="+54 11 5555-4444"
                        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:bg-white"
                        [style.--tw-ring-color]="t.colores.secundario"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">
                      Dirección de entrega o localidad
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      [(ngModel)]="cliente.direccionEntrega"
                      placeholder="Ej: Av. Rivadavia 1234, CABA"
                      class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:bg-white"
                      [style.--tw-ring-color]="t.colores.secundario"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">
                      Observaciones o especificaciones adicionales
                    </label>
                    <textarea
                      name="observaciones"
                      [(ngModel)]="cliente.observaciones"
                      rows="3"
                      placeholder="Detalles de facturación, talles, horarios de entrega o requerimientos..."
                      class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:bg-white resize-none"
                      [style.--tw-ring-color]="t.colores.secundario"
                    ></textarea>
                  </div>

                  @if (mensajeError()) {
                    <div class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                      {{ mensajeError() }}
                    </div>
                  }

                  <!-- Botón directo de acción si es modo Presupuesto -->
                  @if (tipoOperacion() === 'presupuesto') {
                    <div class="pt-4">
                      <button
                        type="submit"
                        [disabled]="generandoPdf()"
                        class="w-full py-4 px-6 rounded-2xl font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer text-base disabled:opacity-50"
                        [style.backgroundColor]="t.colores.primario"
                      >
                        @if (generandoPdf()) {
                          <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          <span>Generando documento PDF...</span>
                        } @else {
                          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Generar y Descargar Presupuesto PDF</span>
                        }
                      </button>
                      <p class="text-center text-xs text-slate-500 mt-2">
                        El archivo PDF se descargará automáticamente en tu dispositivo.
                      </p>
                    </div>
                  }
                </form>
              </div>

              <!-- Bloque Mercado Pago si es modo Venta Online -->
              @if (tipoOperacion() === 'venta') {
                <div class="space-y-3">
                  <div class="flex items-center gap-2 px-1">
                    <div
                      class="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                      [style.backgroundColor]="t.colores.primario"
                    >
                      2
                    </div>
                    <div>
                      <h2 class="text-lg font-bold text-slate-900">Medio de Pago Online</h2>
                      <p class="text-xs text-slate-500">Completá tus datos arriba y elegí el método de cobro</p>
                    </div>
                  </div>

                  <app-mp-carousel
                    [total]="carritoService.total()"
                    [locale]="t.locale"
                    [moneda]="t.moneda"
                    (pagoIniciado)="onPagoIniciado($event)"
                    (pagoExitosoSimulado)="onPagoExitosoSimulado()"
                  ></app-mp-carousel>
                </div>
              }
            </div>

            <!-- Columna Resumen de Compra -->
            <div class="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              <h2 class="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Tu Pedido</span>
                <span class="text-xs font-normal text-slate-500">
                  {{ carritoService.cantidadTotal() }} ítems
                </span>
              </h2>

              <!-- Lista compacta de ítems -->
              <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 space-y-3 pr-2">
                @for (item of carritoService.itemsSignal(); track item.producto.codigo) {
                  <div class="flex items-center justify-between gap-3 pt-3 first:pt-0">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        @if (item.producto.imagen) {
                          <img [src]="item.producto.imagen" [alt]="item.producto.nombre" class="h-full w-full object-cover" />
                        }
                      </div>
                      <div class="min-w-0">
                        <h4 class="text-xs font-bold text-slate-800 truncate">{{ item.producto.nombre }}</h4>
                        <span class="text-[11px] text-slate-500 block">Cant: {{ item.cantidad }} × {{ item.producto.precio | precio: t.locale: t.moneda }}</span>
                      </div>
                    </div>

                    <span class="text-xs font-bold text-slate-900 shrink-0">
                      {{ (item.producto.precio * item.cantidad) | precio: t.locale: t.moneda }}
                    </span>
                  </div>
                }
              </div>

              <!-- Desglose de totales -->
              <div class="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div class="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{{ carritoService.subtotal() | precio: t.locale: t.moneda }}</span>
                </div>
                <div class="flex justify-between text-slate-500">
                  <span>Impuestos (IVA)</span>
                  <span>Incluido</span>
                </div>
                <div class="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                  <span>Total</span>
                  <span [style.color]="t.colores.primario">
                    {{ carritoService.total() | precio: t.locale: t.moneda }}
                  </span>
                </div>
              </div>

              <!-- Garantías y badges -->
              <div class="rounded-2xl p-4 bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div class="flex items-center gap-2 font-bold text-slate-800">
                  <svg class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Garantía y Transparencia
                </div>
                <p class="text-[11px] text-slate-500 leading-snug">
                  Presupuestos garantizados por {{ t.pdfConfig.validezDias || 7 }} días corridos. Todos nuestros datos fiscales se encuentran registrados.
                </p>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class CheckoutComponent implements OnInit {
  private readonly configService = inject(ConfigService);
  private readonly router = inject(Router);
  private readonly pdfService = inject(PdfService);
  readonly carritoService = inject(CarritoService);

  readonly tienda = this.configService.tiendaActivaSignal;

  tipoOperacion = signal<TipoOperacion>('presupuesto');
  generandoPdf = signal<boolean>(false);
  mensajeError = signal<string>('');

  cliente: ClienteDatos = {
    nombre: '',
    email: '',
    telefono: '',
    observaciones: '',
    direccionEntrega: ''
  };

  ngOnInit(): void {
    const t = this.tienda();
    if (t) {
      if (t.modoCheckout === 'venta') {
        this.tipoOperacion.set('venta');
      } else if (t.modoCheckout === 'presupuesto') {
        this.tipoOperacion.set('presupuesto');
      } else {
        this.tipoOperacion.set('presupuesto');
      }
    }
  }

  setTipoOperacion(tipo: TipoOperacion): void {
    this.tipoOperacion.set(tipo);
    this.mensajeError.set('');
  }

  validarCliente(): boolean {
    if (!this.cliente.nombre.trim()) {
      this.mensajeError.set('Por favor ingresá tu nombre o razón social.');
      return false;
    }
    if (!this.cliente.email.trim() || !this.cliente.email.includes('@')) {
      this.mensajeError.set('Por favor ingresá un correo electrónico válido.');
      return false;
    }
    if (!this.cliente.telefono.trim()) {
      this.mensajeError.set('Por favor ingresá un teléfono o WhatsApp de contacto.');
      return false;
    }
    this.mensajeError.set('');
    return true;
  }

  procesarConfirmacion(): void {
    if (!this.validarCliente()) return;

    const t = this.tienda();
    if (!t) return;

    if (this.tipoOperacion() === 'presupuesto') {
      this.generandoPdf.set(true);

      setTimeout(() => {
        const numeroPresupuesto = this.pdfService.generarPresupuestoPdf(
          t,
          this.cliente,
          this.carritoService.itemsSignal(),
          this.carritoService.total()
        );

        // Guardar detalles de la orden en sessionStorage para la página de confirmación
        const ordenResumen = {
          numero: numeroPresupuesto,
          tipo: 'presupuesto',
          cliente: this.cliente,
          itemsCount: this.carritoService.cantidadTotal(),
          total: this.carritoService.total(),
          tiendaSlug: t.slug,
          tiendaNombre: t.nombre,
          fecha: new Date().toISOString()
        };
        sessionStorage.setItem('ultima_orden', JSON.stringify(ordenResumen));

        // Vaciar carrito
        this.carritoService.vaciarCarrito();
        this.generandoPdf.set(false);

        // Redirigir a página de gracias/confirmación
        this.router.navigate(['/', t.slug, 'confirmacion']);
      }, 500);
    }
  }

  onPagoIniciado(event: { metodoId: string }): void {
    console.log('[Checkout] Pago iniciado con método:', event.metodoId);
  }

  onPagoExitosoSimulado(): void {
    if (!this.validarCliente()) return;

    const t = this.tienda();
    if (!t) return;

    const ordenResumen = {
      numero: `ORD-MP-${Math.floor(100000 + Math.random() * 900000)}`,
      tipo: 'venta',
      cliente: this.cliente,
      itemsCount: this.carritoService.cantidadTotal(),
      total: this.carritoService.total(),
      tiendaSlug: t.slug,
      tiendaNombre: t.nombre,
      fecha: new Date().toISOString()
    };
    sessionStorage.setItem('ultima_orden', JSON.stringify(ordenResumen));

    this.carritoService.vaciarCarrito();
    this.router.navigate(['/', t.slug, 'confirmacion']);
  }
}
