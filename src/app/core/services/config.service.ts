import { Injectable, signal, computed } from '@angular/core';
import { TiendaConfig, TiendasConfigMap } from '../models/tienda.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // Signal con la configuración completa de todas las tiendas
  private readonly configMapSignal = signal<TiendasConfigMap>({});

  // Signal reactivo de la tienda actualmente activa
  readonly tiendaActivaSignal = signal<TiendaConfig | null>(null);

  // Lista computada de tiendas disponibles para navegación y 404
  readonly tiendasDisponibles = computed<TiendaConfig[]>(() => {
    const map = this.configMapSignal();
    return Object.values(map);
  });

  constructor() {
    this.cargarConfiguracion();
  }

  /**
   * Carga la configuración desde window.TIENDAS_CONFIG expuesto por public/config/tiendas.config.js
   * Si no estuviera disponible, utiliza el fallback embebido para garantizar resiliencia.
   */
  private cargarConfiguracion(): void {
    if (typeof window !== 'undefined' && window.TIENDAS_CONFIG && Object.keys(window.TIENDAS_CONFIG).length > 0) {
      this.configMapSignal.set(window.TIENDAS_CONFIG);
    } else {
      // Fallback de resiliencia
      this.configMapSignal.set(this.obtenerConfiguracionFallback());
    }
  }

  /**
   * Obtiene la configuración de una tienda específica por su slug.
   */
  getTienda(slug: string): TiendaConfig | null {
    const config = this.configMapSignal();
    return config[slug] || null;
  }

  /**
   * Activa una tienda en el signal global. Retorna true si existe, false si es 404.
   */
  setTiendaActiva(slug: string): boolean {
    // Reasegurar carga por si el script tardó en cargarse
    if (Object.keys(this.configMapSignal()).length === 0) {
      this.cargarConfiguracion();
    }

    const tienda = this.getTienda(slug);
    if (tienda) {
      this.tiendaActivaSignal.set(tienda);
      return true;
    } else {
      this.tiendaActivaSignal.set(null);
      return false;
    }
  }

  /**
   * Limpia la tienda activa al salir de la ruta
   */
  clearTiendaActiva(): void {
    this.tiendaActivaSignal.set(null);
  }

  /**
   * Configuración de respaldo embebida
   */
  private obtenerConfiguracionFallback(): TiendasConfigMap {
    return {
      tienda1: {
        slug: 'tienda1',
        nombre: 'Aura Urban Style',
        rubro: 'Indumentaria & Calzado Urbano',
        slogan: 'Moda urbana contemporánea diseñada para destacar tu personalidad.',
        logo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="48" height="48" x="6" y="6" rx="12" fill="%231e293b"/><path d="M18 42 L30 18 L42 42 M23 34 L37 34" stroke="%23f59e0b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><text x="64" y="32" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="22" fill="%231e293b" letter-spacing="1">AURA</text><text x="64" y="47" font-family="Plus Jakarta Sans, sans-serif" font-weight="600" font-size="12" fill="%23f59e0b" letter-spacing="3">URBAN STYLE</text></svg>`,
        colores: {
          primario: '#1e293b',
          secundario: '#f59e0b',
          fondo: '#f8fafc',
          texto: '#0f172a',
          acento: '#e11d48'
        },
        info: {
          quienesSomos: 'Somos una marca independiente nacida para fusionar la comodidad del streetwear con la elegancia del corte contemporáneo. Confección ética y materiales de primera calidad.',
          direccion: 'Av. Santa Fe 2450, Recoleta, CABA',
          telefono: '+54 11 4821-9900',
          email: 'contacto@aurastyle.com.ar',
          whatsapp: '5491148219900',
          horarios: 'Lunes a Sábados: 10:00 a 20:00 hs',
          redes: {
            instagram: '@auraurbanstyle',
            facebook: 'auraurbanstyle',
            web: 'www.aurastyle.com.ar'
          }
        },
        moneda: 'ARS',
        locale: 'es-AR',
        modoCheckout: 'ambos',
        textosPie: '© 2026 Aura Urban Style. Diseños registrados. Envíos express a todo el país.',
        pdfConfig: {
          razonSocial: 'AURA TEXTIL S.A.S.',
          cuit: '30-71649281-9',
          domicilioFiscal: 'Av. Santa Fe 2450, CABA',
          contacto: 'ventas@aurastyle.com.ar | Tel: (011) 4821-9900',
          validezDias: 7,
          leyendas: 'Los precios cotizados incluyen IVA. Presupuesto sujeto a disponibilidad de stock al momento de la confirmación formal.'
        },
        hojaExcel: 'tienda1'
      },
      tienda2: {
        slug: 'tienda2',
        nombre: 'Volt Gaming & Tech',
        rubro: 'Hardware, Periféricos & Streaming',
        slogan: 'Lleva tu setup al siguiente nivel con hardware y periféricos de alto rendimiento.',
        logo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="48" height="48" x="6" y="6" rx="12" fill="%2306b6d4"/><path d="M34 14 L22 28 L30 28 L20 46 L36 29 L27 29 Z" fill="%230b0f19"/><text x="64" y="32" font-family="Outfit, sans-serif" font-weight="900" font-size="24" fill="%2306b6d4" letter-spacing="1">VOLT</text><text x="64" y="47" font-family="Outfit, sans-serif" font-weight="600" font-size="11" fill="%238b5cf6" letter-spacing="3">GAMING &amp; TECH</text></svg>`,
        colores: {
          primario: '#0b1329',
          secundario: '#06b6d4',
          fondo: '#0f172a',
          texto: '#f8fafc',
          acento: '#8b5cf6'
        },
        info: {
          quienesSomos: 'Especialistas apasionados por la tecnología, eSports y creación de contenido. Distribuidores oficiales de las marcas líderes mundiales con garantía directa y soporte gamer.',
          direccion: 'Florida 537, Galería Jardín, Local 114, CABA',
          telefono: '+54 11 5263-8822',
          email: 'ventas@volttech.com.ar',
          whatsapp: '5491152638822',
          horarios: 'Lunes a Viernes: 10:00 a 19:00 hs | Sábados: 10:00 a 14:00 hs',
          redes: {
            instagram: '@volt.gaming.tech',
            facebook: 'volttechgaming',
            web: 'www.volttech.com.ar'
          }
        },
        moneda: 'ARS',
        locale: 'es-AR',
        modoCheckout: 'venta',
        textosPie: '© 2026 Volt Gaming & Tech. Todos los productos cuentan con 12 meses de garantía oficial escrita.',
        pdfConfig: {
          razonSocial: 'VOLT INNOVATION GROUP S.R.L.',
          cuit: '33-71829471-9',
          domicilioFiscal: 'Florida 537 Local 114, CABA',
          contacto: 'soporte@volttech.com.ar | Tel: (011) 5263-8822',
          validezDias: 5,
          leyendas: 'Precios en pesos con IVA incluido. Pagos con tarjeta de crédito, débito o transferencia instantánea.'
        },
        hojaExcel: 'tienda2'
      },
      tienda3: {
        slug: 'tienda3',
        nombre: 'Terra Viva Natural',
        rubro: 'Almacén Orgánico & Delicatessen',
        slogan: 'Alimentos conscientes, puros de origen y de pequeños productores artesanales.',
        logo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><circle cx="30" cy="30" r="24" fill="%231b4332"/><path d="M22 36 C22 25 31 16 38 18 C37 28 31 38 22 36 Z M26 31 C32 28 35 24 35 24" stroke="%23d97706" stroke-width="2.5" stroke-linecap="round" fill="none"/><text x="64" y="32" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="20" fill="%231b4332" letter-spacing="0.5">TERRA VIVA</text><text x="64" y="47" font-family="Plus Jakarta Sans, sans-serif" font-weight="600" font-size="11" fill="%23bc6c25" letter-spacing="2">ALMACÉN NATURAL</text></svg>`,
        colores: {
          primario: '#1b4332',
          secundario: '#d97706',
          fondo: '#fcfbf7',
          texto: '#1c2d22',
          acento: '#bc6c25'
        },
        info: {
          quienesSomos: 'Conectamos a familias y amantes del buen comer con alimentos agroecológicos de estación, mieles de monte virgen, aceites varietales y blends de café tostados artesanalmente.',
          direccion: 'Jorge Newbery 3560, Colegiales, CABA',
          telefono: '+54 11 4552-3341',
          email: 'hola@terravivanatural.com',
          whatsapp: '5491145523341',
          horarios: 'Martes a Domingos: 09:00 a 20:00 hs',
          redes: {
            instagram: '@terravivanatural',
            facebook: 'terravivanatural',
            web: 'www.terravivanatural.com'
          }
        },
        moneda: 'ARS',
        locale: 'es-AR',
        modoCheckout: 'presupuesto',
        textosPie: '© 2026 Terra Viva Almacén Natural. Cuidando tu salud y apoyando el comercio justo.',
        pdfConfig: {
          razonSocial: 'TERRA VIVA AGROECOLÓGICA S.A.',
          cuit: '30-71452918-4',
          domicilioFiscal: 'Jorge Newbery 3560, CABA',
          contacto: 'pedidos@terravivanatural.com | Tel: (011) 4552-3341',
          validezDias: 7,
          leyendas: 'Cotización sujeta a disponibilidad de cosecha y fraccionamiento artesanal.'
        },
        hojaExcel: 'tienda3'
      }
    };
  }
}
