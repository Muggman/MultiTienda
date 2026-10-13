import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ConfigService } from '../../core/services/config.service';
import { ThemeService } from '../../core/services/theme.service';
import { CarritoService } from '../../core/services/carrito.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CarritoDrawerComponent } from './carrito/carrito-drawer.component';
import { TiendaNotFoundComponent } from './not-found/tienda-not-found.component';

@Component({
  selector: 'app-tienda-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CarritoDrawerComponent,
    TiendaNotFoundComponent
  ],
  template: `
    @if (tiendaValida()) {
      @if (configService.tiendaActivaSignal(); as t) {
        <div class="min-h-screen flex flex-col justify-between selection:bg-slate-800 selection:text-white">
          <app-header
            [tienda]="t"
          ></app-header>

          <main class="flex-1">
            <router-outlet></router-outlet>
          </main>

          <app-carrito-drawer
            [tienda]="t"
          ></app-carrito-drawer>

          <app-footer
            [tienda]="t"
          ></app-footer>
        </div>
      }
    } @else {
      <!-- 404 si el slug no existe -->
      <app-tienda-not-found></app-tienda-not-found>
    }
  `
})
export class TiendaLayoutComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly configService = inject(ConfigService);
  private readonly themeService = inject(ThemeService);
  private readonly carritoService = inject(CarritoService);

  tiendaValida = this.configService.tiendaActivaSignal;

  ngOnInit(): void {
    // Escuchar parámetros de ruta para cargar la tienda adecuada
    this.route.paramMap.subscribe(params => {
      const slug = params.get('tiendaSlug');
      if (slug) {
        const existe = this.configService.setTiendaActiva(slug);
        if (existe) {
          const tienda = this.configService.getTienda(slug)!;
          this.themeService.aplicarColores(tienda.colores);
          this.carritoService.cargarParaTienda(slug);

          // Título de la pestaña del navegador
          if (typeof document !== 'undefined') {
            document.title = `${tienda.nombre} | ${tienda.rubro}`;
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.themeService.restablecerColores();
  }
}
