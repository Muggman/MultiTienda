import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../core/services/config.service';

@Component({
  selector: 'app-tienda-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div class="max-w-2xl w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm text-center">
        <!-- Badge 404 -->
        <span class="inline-block px-3.5 py-1 rounded-full text-xs font-black tracking-widest text-rose-700 bg-rose-50 border border-rose-200 mb-4">
          ERROR 404 • TIENDA NO ENCONTRADA
        </span>

        <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          La tienda solicitada no existe
        </h1>

        <p class="text-sm text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
          No pudimos encontrar la tienda correspondiente al enlace ingresado. Por favor verificá la dirección o explorá una de nuestras tiendas activas:
        </p>

        <!-- Tarjetas de tiendas disponibles -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
          @for (tienda of configService.tiendasDisponibles(); track tienda.slug) {
            <a
              [routerLink]="['/', tienda.slug]"
              class="group block p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div class="h-10 w-10 rounded-xl mb-3 flex items-center justify-center text-white font-bold"
                [style.backgroundColor]="tienda.colores.primario"
              >
                {{ tienda.nombre.charAt(0) }}
              </div>
              <h3 class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {{ tienda.nombre }}
              </h3>
              <p class="text-xs text-slate-500 mt-1 line-clamp-1">
                {{ tienda.rubro }}
              </p>
              <span class="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 mt-3 group-hover:translate-x-0.5 transition-transform">
                <span>Ingresar</span>
                <span>→</span>
              </span>
            </a>
          }
        </div>

        <div class="pt-6 border-t border-slate-100 text-xs text-slate-400">
          ¿Querés agregar una nueva tienda? Configurá una clave nueva en <code class="text-slate-600 font-mono">public/config/tiendas.config.js</code> y agregá su hoja correspondiente en <code class="text-slate-600 font-mono">public/data/productos.xlsx</code>.
        </div>
      </div>
    </div>
  `
})
export class TiendaNotFoundComponent {
  readonly configService = inject(ConfigService);
}
