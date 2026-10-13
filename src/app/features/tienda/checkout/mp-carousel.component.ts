import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrecioPipe } from '../../../shared/pipes/precio.pipe';

interface MetodoPago {
  id: string;
  nombre: string;
  categoria: 'credito' | 'debito' | 'cuenta' | 'efectivo';
  iconoSvg: string;
  badge: string;
  descripcion: string;
  cuotasPromo?: string;
}

@Component({
  selector: 'app-mp-carousel',
  standalone: true,
  imports: [CommonModule, PrecioPipe],
  template: `
    <div class="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50/50 to-white p-6 shadow-sm">
      <!-- Encabezado de Mercado Pago -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-sky-100 pb-5">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#009ee3] text-white shadow-sm">
            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-lg tracking-tight text-slate-800">Mercado Pago</span>
              <span class="rounded bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">Checkout Pro</span>
            </div>
            <p class="text-xs text-slate-500">Pasarela segura oficial • Encriptación SSL 256-bit</p>
          </div>
        </div>

        <div class="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Compra 100% Protegida
        </div>
      </div>

      <!-- Resumen del Importe a Pagar -->
      <div class="my-5 flex items-center justify-between rounded-xl bg-slate-900 px-5 py-4 text-white">
        <div>
          <span class="text-xs uppercase tracking-wider text-slate-400">Total a abonar</span>
          <p class="text-2xl font-bold tracking-tight text-sky-400">
            {{ total() | precio: locale(): moneda() }}
          </p>
        </div>
        <div class="text-right text-xs text-slate-300">
          <span class="inline-block rounded bg-slate-800 px-2.5 py-1 text-slate-300 border border-slate-700">
            Hasta 6 cuotas fijas
          </span>
        </div>
      </div>

      <!-- Carrusel / Selector de Medios de Pago -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Medios de pago habilitados
          </h4>
          <span class="text-xs text-slate-500">Seleccioná tu método preferido</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          @for (metodo of metodos; track metodo.id) {
            <button
              type="button"
              (click)="seleccionarMetodo(metodo.id)"
              [class.ring-2]="metodoSeleccionado() === metodo.id"
              [class.ring-[#009ee3]]="metodoSeleccionado() === metodo.id"
              [class.bg-white]="metodoSeleccionado() === metodo.id"
              [class.shadow-md]="metodoSeleccionado() === metodo.id"
              class="relative text-left p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="text-xs font-semibold text-[#009ee3] bg-sky-50 px-2 py-0.5 rounded">
                    {{ metodo.badge }}
                  </span>
                  @if (metodoSeleccionado() === metodo.id) {
                    <span class="h-2.5 w-2.5 rounded-full bg-[#009ee3]"></span>
                  }
                </div>
                <h5 class="text-sm font-bold text-slate-800 mb-1">{{ metodo.nombre }}</h5>
                <p class="text-xs text-slate-500 leading-snug">{{ metodo.descripcion }}</p>
              </div>

              @if (metodo.cuotasPromo) {
                <div class="mt-3 pt-2 border-t border-slate-100 text-[11px] font-semibold text-emerald-700">
                  {{ metodo.cuotasPromo }}
                </div>
              }
            </button>
          }
        </div>
      </div>

      <!-- Tarjetas soportadas / logotipos -->
      <div class="flex flex-wrap items-center justify-center gap-4 py-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-400">
        <span class="font-medium text-slate-500">Aceptamos:</span>
        <span class="font-bold text-slate-700">VISA</span>
        <span class="font-bold text-slate-700">Mastercard</span>
        <span class="font-bold text-slate-700">American Express</span>
        <span class="font-bold text-slate-700">Cabal</span>
        <span class="font-bold text-slate-700">Naranja</span>
        <span class="font-bold text-slate-700">Pago Fácil</span>
        <span class="font-bold text-slate-700">RapiPago</span>
        <span class="font-bold text-slate-700">Dinero en MP</span>
      </div>

      <!-- Botón de Pago con Mercado Pago -->
      <div class="mt-6 flex flex-col items-center">
        <button
          type="button"
          (click)="iniciarPagoMercadoPago()"
          [disabled]="procesando()"
          class="w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white bg-[#009ee3] hover:bg-[#0087c2] active:scale-[0.99] shadow-lg shadow-sky-500/25 transition-all cursor-pointer text-base disabled:opacity-50"
        >
          @if (procesando()) {
            <svg class="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Conectando con Mercado Pago...</span>
          } @else {
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            <span>Pagar con Mercado Pago</span>
          }
        </button>

        <p class="mt-3 text-center text-xs text-slate-500 max-w-md">
          Al hacer clic serás redirigido al entorno seguro de Mercado Pago para completar tu pago de forma instantánea.
        </p>
      </div>

      <!-- Modal informativo de integración Mock / Sandbox -->
      @if (mostrarModalInfo()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div class="flex items-center gap-3 mb-4 text-[#009ee3]">
              <div class="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                <svg class="h-6 w-6 text-[#009ee3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900">Integración Mercado Pago (Checkout Pro)</h3>
            </div>

            <p class="text-sm text-slate-600 mb-4 leading-relaxed">
              Este componente actúa como <strong>placeholder funcional</strong> listo para producción. En un entorno productivo con backend, aquí se ejecutan los siguientes pasos:
            </p>

            <div class="rounded-xl bg-slate-900 p-4 text-xs font-mono text-emerald-400 mb-5 overflow-x-auto space-y-1">
              <div class="text-slate-400">// Puntos de integración documentados:</div>
              <div>1. POST /api/checkout/crear-preferencia</div>
              <div class="text-sky-300">   body: &#123; items, pagador, tiendaId &#125;</div>
              <div>2. Recibe &#123; id: "PREF_123", init_point: "https://mercadopago.com/..." &#125;</div>
              <div>3. window.location.href = data.init_point;</div>
            </div>

            <div class="flex items-center justify-end gap-3">
              <button
                type="button"
                (click)="cerrarModalInfo()"
                class="px-5 py-2.5 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-sm"
              >
                Cerrar
              </button>
              <button
                type="button"
                (click)="simularPagoExitoso()"
                class="px-5 py-2.5 rounded-xl font-bold text-white bg-[#009ee3] hover:bg-[#0087c2] transition-colors cursor-pointer text-sm"
              >
                Simular Pago Aprobado
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class MercadoPagoCarouselComponent {
  total = input.required<number>();
  locale = input<string>('es-AR');
  moneda = input<string>('ARS');

  pagoIniciado = output<{ metodoId: string }>();
  pagoExitosoSimulado = output<void>();

  metodoSeleccionado = signal<string>('credito');
  procesando = signal<boolean>(false);
  mostrarModalInfo = signal<boolean>(false);

  metodos: MetodoPago[] = [
    {
      id: 'credito',
      nombre: 'Tarjetas de Crédito',
      categoria: 'credito',
      iconoSvg: 'credit-card',
      badge: 'Hasta 6 cuotas',
      descripcion: 'Visa, Mastercard, Amex, Cabal. Acreditación instantánea.',
      cuotasPromo: '✓ Cuotas sin interés disponibles'
    },
    {
      id: 'debito',
      nombre: 'Tarjetas de Débito',
      categoria: 'debito',
      iconoSvg: 'banknotes',
      badge: 'Débito Inmediato',
      descripcion: 'Visa Débito, Maestro, Cabal Débito. Sin recargo adicional.',
      cuotasPromo: '✓ Pago en 1 pago directo'
    },
    {
      id: 'cuenta',
      nombre: 'Dinero en Cuenta MP',
      categoria: 'cuenta',
      iconoSvg: 'wallet',
      badge: 'Saldo Disponible',
      descripcion: 'Pagá con tu cuenta Mercado Pago con un solo toque.',
      cuotasPromo: '✓ Acreditación al segundo'
    },
    {
      id: 'efectivo',
      nombre: 'Efectivo / Rapipago',
      categoria: 'efectivo',
      iconoSvg: 'receipt',
      badge: 'Sucursales',
      descripcion: 'Pago Fácil, RapiPago y Cobro Express en todo el país.',
      cuotasPromo: '✓ Cupón de pago descargable'
    }
  ];

  seleccionarMetodo(id: string): void {
    this.metodoSeleccionado.set(id);
  }

  iniciarPagoMercadoPago(): void {
    this.procesando.set(true);

    /**
     * =========================================================================
     * PUNTOS DE INTEGRACIÓN CON MERCADO PAGO CHECKOUT PRO:
     * =========================================================================
     *
     * 1. Creación de Preferencia en Backend:
     *    const respuesta = await fetch('/api/mercadopago/crear-preferencia', {
     *      method: 'POST',
     *      headers: { 'Content-Type': 'application/json' },
     *      body: JSON.stringify({
     *        items: this.items,
     *        payer: { name: cliente.nombre, email: cliente.email },
     *        back_urls: {
     *          success: `${window.location.origin}/${slug}/confirmacion?status=success`,
     *          failure: `${window.location.origin}/${slug}/confirmacion?status=failure`,
     *          pending: `${window.location.origin}/${slug}/confirmacion?status=pending`
     *        },
     *        auto_return: 'approved'
     *      })
     *    });
     *    const { init_point } = await respuesta.json();
     *
     * 2. Redirección al Checkout Pro de Mercado Pago:
     *    window.location.href = init_point;
     * =========================================================================
     */

    setTimeout(() => {
      this.procesando.set(false);
      this.mostrarModalInfo.set(true);
      this.pagoIniciado.emit({ metodoId: this.metodoSeleccionado() });
    }, 700);
  }

  cerrarModalInfo(): void {
    this.mostrarModalInfo.set(false);
  }

  simularPagoExitoso(): void {
    this.mostrarModalInfo.set(false);
    this.pagoExitosoSimulado.emit();
  }
}
