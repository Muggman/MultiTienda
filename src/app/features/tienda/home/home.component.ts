import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../core/services/config.service';
import { BannerComponent } from '../../../shared/banner/banner.component';
import { InfoBlockComponent } from '../../../shared/info-block/info-block.component';
import { CatalogoComponent } from '../catalogo/catalogo.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BannerComponent, InfoBlockComponent, CatalogoComponent],
  template: `
    @if (tienda(); as t) {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Banner Principal con identidad de la tienda -->
        <app-banner [tienda]="t"></app-banner>

        <!-- Bloque de Información 'Quiénes somos', Contacto y Horarios -->
        <app-info-block [tienda]="t"></app-info-block>

        <!-- Encabezado de Sección del Catálogo -->
        <div class="mt-12 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="h-2.5 w-2.5 rounded-full" [style.backgroundColor]="t.colores.secundario"></span>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Catálogo Oficial</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Productos Destacados
            </h2>
          </div>

          <div class="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            Fuente de datos: <strong class="text-slate-700">Excel (Hoja '{{ t.hojaExcel }}')</strong>
          </div>
        </div>

        <!-- Grilla y Filtros del Catálogo -->
        <app-catalogo [tienda]="t"></app-catalogo>
      </div>
    }
  `
})
export class HomeComponent {
  private readonly configService = inject(ConfigService);
  readonly tienda = this.configService.tiendaActivaSignal;
}
