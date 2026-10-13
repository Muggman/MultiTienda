import { Injectable, effect, inject } from '@angular/core';
import { ConfigService } from './config.service';
import { TiendaColores } from '../models/tienda.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly configService = inject(ConfigService);

  private readonly coloresPorDefecto: TiendaColores = {
    primario: '#1e293b',
    secundario: '#f59e0b',
    fondo: '#f8fafc',
    texto: '#0f172a',
    acento: '#e11d48'
  };

  constructor() {
    // Escucha cambios en la tienda activa mediante signal effect
    effect(() => {
      const tienda = this.configService.tiendaActivaSignal();
      if (tienda) {
        this.aplicarColores(tienda.colores);
      } else {
        this.restablecerColores();
      }
    });
  }

  /**
   * Aplica los colores de la tienda como variables CSS sobre el elemento raíz :root (document.documentElement)
   */
  aplicarColores(colores: TiendaColores): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.style.setProperty('--color-primario', colores.primario);
    root.style.setProperty('--color-secundario', colores.secundario);
    root.style.setProperty('--color-fondo', colores.fondo);
    root.style.setProperty('--color-texto', colores.texto);
    root.style.setProperty('--color-acento', colores.acento);

    // Color de fondo para body
    document.body.style.backgroundColor = colores.fondo;
    document.body.style.color = colores.texto;
  }

  /**
   * Restablece los colores a los valores por defecto
   */
  restablecerColores(): void {
    this.aplicarColores(this.coloresPorDefecto);
  }
}
