import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TiendaConfig } from '../../core/models/tienda.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="mt-20 border-t bg-slate-900 text-slate-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Identidad -->
          <div class="md:col-span-2 space-y-4">
            <div class="flex items-center gap-3">
              @if (tienda().logo) {
                <img
                  [src]="tienda().logo"
                  [alt]="tienda().nombre"
                  class="h-10 w-auto brightness-0 invert object-contain"
                />
              } @else {
                <span class="text-xl font-black text-white">{{ tienda().nombre }}</span>
              }
            </div>

            <p class="text-sm text-slate-400 max-w-sm leading-relaxed">
              {{ tienda().slogan }}
            </p>

            <div class="text-xs text-slate-500 pt-2">
              {{ tienda().textosPie }}
            </div>
          </div>

          <!-- Contacto e info fiscal -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Información</h4>
            <ul class="space-y-2 text-xs text-slate-400">
              <li><strong class="text-slate-300">Dirección:</strong> {{ tienda().info.direccion }}</li>
              <li><strong class="text-slate-300">Tel:</strong> {{ tienda().info.telefono }}</li>
              <li><strong class="text-slate-300">Email:</strong> {{ tienda().info.email }}</li>
              <li><strong class="text-slate-300">CUIT:</strong> {{ tienda().pdfConfig.cuit }}</li>
              <li><strong class="text-slate-300">Razón Social:</strong> {{ tienda().pdfConfig.razonSocial }}</li>
            </ul>
          </div>

          <!-- Redes y checkout -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Modalidad de Atención</h4>
            <div class="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700 text-xs text-slate-300 space-y-2">
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full" [style.backgroundColor]="tienda().colores.secundario"></span>
                <span class="font-semibold text-white">
                  @if (tienda().modoCheckout === 'presupuesto') {
                    Cotizaciones por Presupuesto
                  } @else if (tienda().modoCheckout === 'venta') {
                    Venta Directa Mercado Pago
                  } @else {
                    Compra Online y Presupuestos
                  }
                </span>
              </div>
              <p class="text-[11px] text-slate-400">
                Horario: {{ tienda().info.horarios }}
              </p>
            </div>

            @if (tienda().info.redes.instagram || tienda().info.redes.web) {
              <div class="mt-4 flex items-center gap-3 text-xs text-slate-400">
                @if (tienda().info.redes.instagram) {
                  <span class="hover:text-white transition-colors cursor-pointer">
                    Instagram: {{ tienda().info.redes.instagram }}
                  </span>
                }
              </div>
            }
          </div>
        </div>

        <div class="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Plataforma Multi-Tienda Angular 19. Todos los derechos reservados.</p>
          <div class="flex items-center gap-4">
            <span class="inline-flex items-center gap-1.5 text-slate-400">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              SheetJS (.xlsx) + jsPDF activo
            </span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  tienda = input.required<TiendaConfig>();
}
