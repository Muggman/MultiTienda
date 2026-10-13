import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiendaConfig } from '../../core/models/tienda.model';

@Component({
  selector: 'app-info-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs my-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Quiénes somos -->
        <div class="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-8">
          <div class="flex items-center gap-2 mb-3">
            <span class="h-2 w-2 rounded-full" [style.backgroundColor]="tienda().colores.secundario"></span>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Sobre nosotros</span>
          </div>
          <h3 class="text-xl font-bold tracking-tight text-slate-900 mb-3">
            {{ tienda().nombre }}
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            {{ tienda().info.quienesSomos }}
          </p>
        </div>

        <!-- Ubicación y Horarios -->
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-100 text-slate-700 shrink-0">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Visitanos en</span>
              <p class="text-sm font-medium text-slate-800">{{ tienda().info.direccion }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-100 text-slate-700 shrink-0">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Horarios de atención</span>
              <p class="text-sm font-medium text-slate-800">{{ tienda().info.horarios }}</p>
            </div>
          </div>
        </div>

        <!-- Canales de Contacto Directo -->
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-100 text-slate-700 shrink-0">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Email comercial</span>
              <a [href]="'mailto:' + tienda().info.email" class="text-sm font-medium text-slate-800 hover:underline">
                {{ tienda().info.email }}
              </a>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="h-9 w-9 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700 shrink-0">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Teléfono / WhatsApp</span>
              <p class="text-sm font-medium text-slate-800">{{ tienda().info.telefono }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class InfoBlockComponent {
  tienda = input.required<TiendaConfig>();
}
