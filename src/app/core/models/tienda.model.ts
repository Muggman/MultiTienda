/**
 * Modelos de datos para la configuración multi-tienda.
 */
export type ModoCheckout = 'presupuesto' | 'venta' | 'ambos';

export interface TiendaColores {
  primario: string;
  secundario: string;
  fondo: string;
  texto: string;
  acento: string;
}

export interface TiendaRedes {
  instagram?: string;
  facebook?: string;
  web?: string;
}

export interface TiendaInfo {
  quienesSomos: string;
  direccion: string;
  telefono: string;
  email: string;
  whatsapp: string;
  horarios: string;
  redes: TiendaRedes;
}

export interface TiendaPdfConfig {
  razonSocial: string;
  cuit: string;
  domicilioFiscal: string;
  contacto: string;
  validezDias: number;
  leyendas: string;
}

export interface TiendaConfig {
  slug: string;
  nombre: string;
  rubro: string;
  slogan: string;
  logo: string;
  colores: TiendaColores;
  info: TiendaInfo;
  moneda: string;
  locale: string;
  modoCheckout: ModoCheckout;
  textosPie: string;
  pdfConfig: TiendaPdfConfig;
  hojaExcel: string;
}

export type TiendasConfigMap = Record<string, TiendaConfig>;

declare global {
  interface Window {
    TIENDAS_CONFIG?: TiendasConfigMap;
  }
}
