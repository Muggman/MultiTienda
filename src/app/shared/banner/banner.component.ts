import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiendaConfig } from '../../core/models/tienda.model';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative overflow-hidden rounded-3xl text-white shadow-xl my-6"
      [style.background]="'linear-gradient(135deg, ' + tienda().colores.primario + ' 0%, #0f172a 100%)'"
    >
      <!-- Formas decorativas sutiles de fondo -->
      <div
        class="absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        [style.backgroundColor]="tienda().colores.secundario"
      ></div>
      <div
        class="absolute -left-20 -bottom-20 h-72 w-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        [style.backgroundColor]="tienda().colores.acento"
      ></div>

      <div class="relative z-10 px-6 py-10 sm:px-12 sm:py-14 max-w-4xl">
        <!-- Rubro badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/15 bg-white/10 backdrop-blur-xs">
          <span class="h-1.5 w-1.5 rounded-full" [style.backgroundColor]="tienda().colores.secundario"></span>
          <span>{{ tienda().rubro }}</span>
        </div>

        <!-- Slogan principal -->
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 text-white">
          {{ tienda().slogan }}
        </h1>

        <!-- Breve descripción -->
        <p class="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-8">
          {{ tienda().info.quienesSomos }}
        </p>

        <!-- Perks / Ventajas destacadas de la tienda -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs sm:text-sm">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/15 shrink-0">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <span class="font-bold block text-white">Catálogo Actualizado</span>
              <span class="text-slate-400 text-xs">Directo desde planilla</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/15 shrink-0">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                @if (tienda().modoCheckout === 'presupuesto') {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                } @else if (tienda().modoCheckout === 'venta') {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                }
              </svg>
            </div>
            <div>
              <span class="font-bold block text-white">
                @if (tienda().modoCheckout === 'presupuesto') {
                  Cotización en PDF
                } @else if (tienda().modoCheckout === 'venta') {
                  Pago Seguro Online
                } @else {
                  Venta o Presupuesto
                }
              </span>
              <span class="text-slate-400 text-xs">Gestión transparente</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/15 shrink-0">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span class="font-bold block text-white">Atención Personalizada</span>
              <span class="text-slate-400 text-xs">{{ tienda().info.horarios }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BannerComponent {
  tienda = input.required<TiendaConfig>();
}
