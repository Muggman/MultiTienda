import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConfigService } from '../../../core/services/config.service';
import { PrecioPipe } from '../../../shared/pipes/precio.pipe';

interface OrdenResumen {
  numero: string;
  tipo: 'presupuesto' | 'venta';
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
    direccionEntrega?: string;
  };
  itemsCount: number;
  total: number;
  tiendaSlug: string;
  tiendaNombre: string;
  fecha: string;
}

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, RouterLink, PrecioPipe],
  template: `
    @if (tienda(); as t) {
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm text-center">
          <!-- Ícono de Éxito -->
          <div class="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs">
            <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <!-- Mensaje Principal -->
          <span class="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 mb-3">
            @if (orden()?.tipo === 'presupuesto') {
              ¡Presupuesto Generado con Éxito!
            } @else {
              ¡Operación Confirmada!
            }
          </span>

          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            ¡Muchas gracias por elegirnos!
          </h1>

          <p class="text-sm text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed">
            @if (orden()?.tipo === 'presupuesto') {
              Tu documento PDF con la cotización formal se descargó en tu navegador. Tiene una validez de 7 días corridos para congelar precios.
            } @else {
              Hemos recibido la confirmación de tu compra para <strong>{{ t.nombre }}</strong>. Nos pondremos en contacto a la brevedad para coordinar la entrega.
            }
          </p>

          <!-- Tarjeta de Resumen -->
          @if (orden(); as ord) {
            <div class="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-left max-w-lg mx-auto mb-8 space-y-3 text-xs">
              <div class="flex items-center justify-between pb-3 border-b border-slate-200">
                <span class="text-slate-500 font-medium">Comprobante N°:</span>
                <span class="font-mono font-bold text-slate-900 text-sm">{{ ord.numero }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-slate-500">Destinatario:</span>
                <span class="font-semibold text-slate-800">{{ ord.cliente.nombre }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-slate-500">Email:</span>
                <span class="font-medium text-slate-800">{{ ord.cliente.email }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-slate-500">Teléfono:</span>
                <span class="font-medium text-slate-800">{{ ord.cliente.telefono }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-slate-500">Cantidad de Productos:</span>
                <span class="font-semibold text-slate-800">{{ ord.itemsCount }} unidades</span>
              </div>

              <div class="flex items-center justify-between pt-3 border-t border-slate-200 text-sm">
                <span class="font-bold text-slate-700">Importe Total:</span>
                <span class="font-black text-slate-900" [style.color]="t.colores.primario">
                  {{ ord.total | precio: t.locale: t.moneda }}
                </span>
              </div>
            </div>
          }

          <!-- Botones de Acción -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <!-- Contactar por WhatsApp con mensaje pre-armado -->
            @if (t.info.whatsapp) {
              <a
                [href]="urlWhatsApp()"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/>
                </svg>
                <span>Avisar por WhatsApp</span>
              </a>
            }

            <a
              [routerLink]="['/', t.slug]"
              class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Volver al inicio de {{ t.nombre }}
            </a>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmacionComponent implements OnInit {
  private readonly configService = inject(ConfigService);
  readonly tienda = this.configService.tiendaActivaSignal;

  orden = signal<OrdenResumen | null>(null);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('ultima_orden');
      if (raw) {
        try {
          this.orden.set(JSON.parse(raw));
        } catch {
          this.orden.set(null);
        }
      }
    }
  }

  urlWhatsApp(): string {
    const t = this.tienda();
    const ord = this.orden();
    if (!t || !t.info.whatsapp) return '#';

    const texto = ord
      ? `Hola ${t.nombre}, acabo de generar el comprobante ${ord.numero} a nombre de ${ord.cliente.nombre}. Quería coordinar los detalles.`
      : `Hola ${t.nombre}, tengo una consulta sobre sus productos.`;

    return `https://wa.me/${t.info.whatsapp}?text=${encodeURIComponent(texto)}`;
  }
}
