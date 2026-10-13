import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Producto } from '../models/producto.model';

/**
 * Interfaz de desacoplamiento para proveedores de productos.
 * Permite reemplazar la fuente (Excel, API REST, GraphQL) sin modificar los componentes.
 */
export interface ProductosProvider {
  obtenerProductosPorHoja(hoja: string): Promise<Producto[]>;
  obtenerCategorias(productos: Producto[]): string[];
}

interface RawExcelRow {
  codigo?: string | number;
  nombre?: string;
  descripcion?: string;
  categoria?: string;
  precio?: string | number;
  imagen?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService implements ProductosProvider {
  // Caché en memoria para evitar descargar y procesar el archivo Excel en cada navegación
  private cacheProductosPorHoja = new Map<string, Producto[]>();
  private workbookCache: XLSX.WorkBook | null = null;
  private cargandoPromesa: Promise<XLSX.WorkBook> | null = null;

  /**
   * Obtiene la lista de productos de una hoja de cálculo dada.
   * Si ya fue consultada, devuelve el resultado desde la caché.
   */
  async obtenerProductosPorHoja(hoja: string): Promise<Producto[]> {
    // 1. Revisar caché
    if (this.cacheProductosPorHoja.has(hoja)) {
      return this.cacheProductosPorHoja.get(hoja)!;
    }

    try {
      // 2. Cargar el libro de trabajo si no está en caché
      const wb = await this.cargarWorkbook();

      if (!wb.Sheets[hoja]) {
        console.warn(`[ProductosService] La hoja "${hoja}" no existe en el Excel. Usando datos de respaldo.`);
        const fallback = this.obtenerFallbackPorHoja(hoja);
        this.cacheProductosPorHoja.set(hoja, fallback);
        return fallback;
      }

      const worksheet = wb.Sheets[hoja];
      const rawRows = XLSX.utils.sheet_to_json<RawExcelRow>(worksheet);

      const productos: Producto[] = rawRows.map((row) => ({
        codigo: String(row.codigo || '').trim(),
        nombre: String(row.nombre || '').trim(),
        descripcion: String(row.descripcion || '').trim(),
        categoria: String(row.categoria || 'General').trim(),
        precio: typeof row.precio === 'number' ? row.precio : Number(row.precio) || 0,
        imagen: row.imagen ? String(row.imagen).trim() : undefined
      }));

      this.cacheProductosPorHoja.set(hoja, productos);
      return productos;
    } catch (error) {
      console.warn('[ProductosService] Error al leer el Excel remoto. Utilizando catálogo de respaldo embebido:', error);
      const fallback = this.obtenerFallbackPorHoja(hoja);
      this.cacheProductosPorHoja.set(hoja, fallback);
      return fallback;
    }
  }

  /**
   * Extrae la lista única y ordenada de categorías para filtros
   */
  obtenerCategorias(productos: Producto[]): string[] {
    const cats = new Set<string>();
    for (const p of productos) {
      if (p.categoria) {
        cats.add(p.categoria);
      }
    }
    return Array.from(cats).sort();
  }

  /**
   * Descarga y parsea el archivo public/data/productos.xlsx
   */
  private async cargarWorkbook(): Promise<XLSX.WorkBook> {
    if (this.workbookCache) {
      return this.workbookCache;
    }

    if (this.cargandoPromesa) {
      return this.cargandoPromesa;
    }

    this.cargandoPromesa = (async () => {
      const response = await fetch('/data/productos.xlsx');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: no se pudo cargar /data/productos.xlsx`);
      }
      const buffer = await response.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      this.workbookCache = wb;
      return wb;
    })();

    return this.cargandoPromesa;
  }

  /**
   * Datos de fallback idénticos a los del script generar-excel.mjs
   */
  private obtenerFallbackPorHoja(hoja: string): Producto[] {
    const fallbacks: Record<string, Producto[]> = {
      tienda1: [
        {
          codigo: 'IND-001',
          nombre: 'Remera Oversize Acid Wash',
          descripcion: 'Algodón peinado premium 24/1 con proceso de lavado artesanal acid wash. Calce relaxed unisex.',
          categoria: 'Remeras',
          precio: 28500,
          imagen: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'IND-002',
          nombre: 'Hoodie Canguro French Terry',
          descripcion: 'Buzo con capucha friza liviana peinada, bolsillo frontal reforzado y cordón de ajuste trenzado.',
          categoria: 'Buzos',
          precio: 54900,
          imagen: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'IND-003',
          nombre: 'Pantalón Cargo Táctico Street',
          descripcion: 'Confeccionado en ripstop antidesgarro con 6 bolsillos multifunción y botamanga regulable.',
          categoria: 'Pantalones',
          precio: 62000,
          imagen: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'IND-004',
          nombre: 'Campera Bomber Nylon Vintage',
          descripcion: 'Forro interno contrastante naranja, cierres YKK reforzados y puños acanalados elásticos.',
          categoria: 'Abrigos',
          precio: 89000,
          imagen: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'IND-005',
          nombre: 'Vestido Midi Lino & Rayón',
          descripcion: 'Diseño fresco y fluido con botones frontales de madera natural y lazo regulable en cintura.',
          categoria: 'Vestidos',
          precio: 49500,
          imagen: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'IND-006',
          nombre: 'Jean Wide Leg Tiro Alto',
          descripcion: 'Denim rígido 100% algodón 12oz con terminación stone wash suave y costuras reforzadas.',
          categoria: 'Pantalones',
          precio: 58000,
          imagen: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'IND-007',
          nombre: 'Camisa Cuello Mao Algodón Pima',
          descripcion: 'Corte sastrero casual con carretel oculto y suave tejido de fibra larga transpirable.',
          categoria: 'Camisas',
          precio: 42000,
          imagen: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'IND-008',
          nombre: 'Zapatillas Urban Retro Gum',
          descripcion: 'Capellada combinada en descarne gamuzado y lona pesada con suela caramelo vulcanizada.',
          categoria: 'Calzado',
          precio: 78500,
          imagen: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'IND-009',
          nombre: 'Gorro Beanie Pescador Acanalado',
          descripcion: 'Punto inglés compacto en acrílico suave antialérgico, calce corto pescador.',
          categoria: 'Accesorios',
          precio: 14900,
          imagen: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'IND-010',
          nombre: 'Mochila Roll-top Impermeable 22L',
          descripcion: 'Compartimento para notebook 15.6 acolchado, cordura 600D resistente al agua y hebillas de metal.',
          categoria: 'Accesorios',
          precio: 46000,
          imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'
        }
      ],
      tienda2: [
        {
          codigo: 'TEC-001',
          nombre: 'Teclado Mecánico RGB Switch Red',
          descripcion: 'Layout TKL 80% en español, switches lineares lubricados de fábrica, keycaps PBT doble inyección.',
          categoria: 'Periféricos',
          precio: 74900,
          imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'TEC-002',
          nombre: 'Auriculares Wireless 7.1 Hi-Res',
          descripcion: 'Drivers de neodimio de 50mm, micrófono desmontable con cancelación activa y 45hs de batería.',
          categoria: 'Audio',
          precio: 92000,
          imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'TEC-003',
          nombre: 'Mouse Gamer Ultraligero 26K DPI',
          descripcion: 'Peso de 53 gramos, sensor óptico PixArt 3395, polling rate de 4000Hz y switches ópticos Omron.',
          categoria: 'Periféricos',
          precio: 48500,
          imagen: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'TEC-004',
          nombre: 'Monitor Gamer 27" 165Hz IPS QHD',
          descripcion: 'Resolución 2560x1440, 1ms GtG, compatibilidad FreeSync y G-Sync, 99% sRGB con soporte ergonómico.',
          categoria: 'Monitores',
          precio: 360000,
          imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'TEC-005',
          nombre: 'Micrófono Condensador USB Cardioide',
          descripcion: 'Ideal para streaming y podcasting, filtro antipop interno, botón mute táctil y perilla de ganancia.',
          categoria: 'Audio',
          precio: 68000,
          imagen: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'TEC-006',
          nombre: 'Mousepad Gamer XXL 900x400mm',
          descripcion: 'Superficie de microfibra de baja fricción optimizada para sensores ópticos, base de goma antideslizante.',
          categoria: 'Accesorios',
          precio: 18500,
          imagen: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'TEC-007',
          nombre: 'Cámara Web 2K Pro 60FPS con Autofocus',
          descripcion: 'Sensor Sony Starvis para poca luz, doble micrófono con reducción de eco y tapa física de privacidad.',
          categoria: 'Streaming',
          precio: 52000,
          imagen: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'TEC-008',
          nombre: 'Hub USB-C 8 en 1 Aluminio',
          descripcion: 'Salida HDMI 4K@60Hz, Power Delivery 100W, 3 puertos USB 3.2 10Gbps y lector SD/TF de alta velocidad.',
          categoria: 'Conectividad',
          precio: 34000,
          imagen: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'TEC-009',
          nombre: 'Soporte de Auriculares RGB con Hub USB',
          descripcion: 'Base pesada con iluminación personalizable, 2 puertos USB passthrough y salida auxiliar 3.5mm.',
          categoria: 'Accesorios',
          precio: 23900,
          imagen: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'TEC-010',
          nombre: 'Brazo Articulado para Micrófono Heavy Duty',
          descripcion: 'Estructura metálica interna con resortes ocultos, rotación 360° y canal para ruteo de cables.',
          categoria: 'Streaming',
          precio: 29500,
          imagen: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80'
        }
      ],
      tienda3: [
        {
          codigo: 'ALM-001',
          nombre: 'Miel Pura de Monte Silvestre 500g',
          descripcion: 'Miel cruda de flores nativas de monte serrano, sin pasteurizar, rica en enzimas y polen activo.',
          categoria: 'Endulzantes',
          precio: 6800,
          imagen: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'ALM-002',
          nombre: 'Aceite de Oliva Extra Virgen 500ml',
          descripcion: 'Primer prensado en frío de aceitunas Arauco y Arbequina de San Juan. Acidez menor a 0.2%.',
          categoria: 'Aceites & Condimentos',
          precio: 14500,
          imagen: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'ALM-003',
          nombre: 'Café de Especialidad Tostado 250g',
          descripcion: 'Granos 100% Arábica de altura (1400m), origen Colombia Huila con notas a caramelo y frutos rojos.',
          categoria: 'Infusiones',
          precio: 16900,
          imagen: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'ALM-004',
          nombre: 'Granola Artesanal con Frutos Secos 400g',
          descripcion: 'Avena arrollada horneada con miel, almendras tostadas, castañas de cajú, semillas de calabaza y coco en escamas.',
          categoria: 'Cereales & Granos',
          precio: 8200,
          imagen: 'https://images.unsplash.com/photo-1517093709141-8636b0632a7a?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'ALM-005',
          nombre: 'Té Matcha Ceremonial Orgánico 50g',
          descripcion: 'Puntas tiernas de té verde tencha molidas en piedra volcánica, grado ceremonial proveniente de Uji, Japón.',
          categoria: 'Infusiones',
          precio: 21000,
          imagen: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'ALM-006',
          nombre: 'Mix Premium de Frutos Secos 500g',
          descripcion: 'Nueces Chandler mariposa, almendras Nonpareil, castañas de cajú tostadas sin sal y avellanas.',
          categoria: 'Snacks Saludables',
          precio: 12400,
          imagen: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'ALM-007',
          nombre: 'Dulce de Leche con Vaina de Vainilla 450g',
          descripcion: 'Elaborado en paila de cobre con leche fresca de tambo pastoril y vainilla natural de Madagascar.',
          categoria: 'Dulces & Mermeladas',
          precio: 7900,
          imagen: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'ALM-008',
          nombre: 'Sal Rosada del Himalaya con Especias 300g',
          descripcion: 'Cristales puros con molinillo de cerámica reutilizable, aromatizada con romero, pimienta negra y pimentón ahumado.',
          categoria: 'Aceites & Condimentos',
          precio: 6100,
          imagen: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'ALM-009',
          nombre: 'Pasta de Maní Tostado Natural 380g',
          descripcion: '100% maní tostado seleccionado sin sal, sin azúcar ni aceites hidrogenados agregados. Textura suave.',
          categoria: 'Snacks Saludables',
          precio: 5300,
          imagen: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80'
        },
        {
          codigo: 'ALM-010',
          nombre: 'Chocolate 80% Cacao Criollo Bean-to-Bar 100g',
          descripcion: 'Cacao fino de aroma origen Ecuador, endulzado sutilmente con azúcar mascabo orgánica.',
          categoria: 'Chocolates & Dulces',
          precio: 8900,
          imagen: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80'
        }
      ]
    };

    return fallbacks[hoja] || [];
  }
}
