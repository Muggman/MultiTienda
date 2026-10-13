# Plataforma E-commerce Multi-Tienda (Angular 19 MVP)

MVP completo y funcional de una **Tienda Online Multi-Tienda** solo front-end (sin backend), construida con **Angular 19**, Standalone Components, Signals reactivos y nuevo control flow (`@if`, `@for`).

---

## 🚀 Características Principales

- **Multi-tienda por ruta dinámica:** `/tienda1`, `/tienda2`, `/tienda3` (`:tiendaSlug`).
- **Página 404 Inteligente:** Si se ingresa un slug inexistente, se muestra una pantalla 404 con accesos directos a todas las tiendas disponibles.
- **Identidad visual dinámica con Variables CSS:** Colores (`--color-primario`, `--color-secundario`, `--color-fondo`, `--color-texto`, `--color-acento`), logo, tipografía y textos se aplican reactivamente al entrar a cada tienda.
- **Configuración desacoplada en tiempo de ejecución:** Archivo plano `public/config/tiendas.config.js` expone `window.TIENDAS_CONFIG`, permitiendo editar o sumar tiendas sin necesidad de recompilar.
- **Catálogo desde Excel:** Lee `public/data/productos.xlsx` en el navegador usando **SheetJS** (`xlsx`), con una hoja por tienda y caché en memoria. Desacoplado mediante la interfaz `ProductosProvider`.
- **Carrito independiente:** Persistencia en `localStorage` por slug de tienda (`tienda_carrito_${slug}`), con drawer lateral reactivo y página completa.
- **Modos de Checkout configurables por tienda:**
  - `presupuesto`: Solicita datos del cliente y genera un PDF formal con **jsPDF** + **jspdf-autotable** con cálculo de validez de 7 días, tabla de ítems y descarga automática.
  - `venta`: Muestra el carrusel de medios de pago con la estética oficial de **Mercado Pago Checkout Pro** (tarjetas mock, badges y puntos de integración documentados).
  - `ambos`: Permite al cliente elegir si desea solicitar presupuesto o comprar online.

---

## 🛠️ Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Generar el archivo Excel de ejemplo con las 3 tiendas
node scripts/generar-excel.mjs

# 3. Iniciar servidor de desarrollo en puerto 3000
npm run dev

# 4. Compilar para producción
npm run build
```

---

## 🏪 Tiendas de Ejemplo Incluidas en el MVP

| Slug | Tienda | Rubro | Modo Checkout | Hoja Excel |
| :--- | :--- | :--- | :--- | :--- |
| `/tienda1` | **Aura Urban Style** | Indumentaria & Calzado Urbano | `ambos` (Presupuesto o Compra) | `tienda1` |
| `/tienda2` | **Volt Gaming & Tech** | Hardware, Periféricos & Streaming | `venta` (Mercado Pago) | `tienda2` |
| `/tienda3` | **Terra Viva Natural** | Almacén Orgánico & Gourmet | `presupuesto` (PDF jsPDF) | `tienda3` |

---

## ➕ Cómo Agregar una Nueva Tienda (ej. `tienda4`)

Para dar de alta una nueva tienda no es necesario tocar el código TypeScript ni recompilar la aplicación:

### Paso 1: Registrar la tienda en `public/config/tiendas.config.js`
Abre `public/config/tiendas.config.js` y agrega el nuevo bloque con la clave `tienda4`:

```javascript
tienda4: {
  slug: 'tienda4',
  nombre: 'Deco Minimal Home',
  rubro: 'Mobiliario & Decoración Nórdica',
  slogan: 'Espacios que transmiten calma y funcionalidad.',
  logo: 'data:image/svg+xml;utf8,...', // URL de imagen o SVG
  colores: {
    primario: '#292524',
    secundario: '#a8a29e',
    fondo: '#fafaf9',
    texto: '#1c1917',
    acento: '#78716c'
  },
  info: {
    quienesSomos: 'Diseñamos objetos y muebles atemporales.',
    direccion: 'Palermo Soho, CABA',
    telefono: '+54 11 4777-1234',
    email: 'contacto@decominimal.com',
    whatsapp: '5491147771234',
    horarios: 'Lunes a Viernes 10:00 a 19:00 hs',
    redes: { instagram: '@decominimal' }
  },
  moneda: 'ARS',
  locale: 'es-AR',
  modoCheckout: 'ambos', // 'presupuesto' | 'venta' | 'ambos'
  textosPie: '© 2026 Deco Minimal. Industria Argentina.',
  pdfConfig: {
    razonSocial: 'DECO MINIMAL S.R.L.',
    cuit: '30-71999888-2',
    domicilioFiscal: 'Honduras 4800, CABA',
    contacto: 'ventas@decominimal.com',
    validezDias: 7,
    leyendas: 'Precios con IVA incluido.'
  },
  hojaExcel: 'tienda4'
}
```

### Paso 2: Crear la hoja en `public/data/productos.xlsx`
Abre `public/data/productos.xlsx` con Excel / LibreOffice / Google Sheets y agrega una nueva hoja llamada **`tienda4`** con las siguientes columnas exactas:

| codigo | nombre | descripcion | categoria | precio | imagen |
| :--- | :--- | :--- | :--- | :--- | :--- |
| DEC-001 | Lámpara de Mesa Arco | Madera de roble y pantalla de lino | Iluminación | 45000 | https://... |
| DEC-002 | Set Floreros Cerámica | Gres esmaltado artesanal mate | Decoración | 28000 | https://... |

*Alternativamente, puedes agregarlos al array `tienda4Productos` en `scripts/generar-excel.mjs` y ejecutar `node scripts/generar-excel.mjs`.*

### Paso 3: Probar en el navegador
Ingresa directamente a:
```
http://localhost:3000/tienda4
```
La aplicación aplicará automáticamente sus colores, logo, catálogo y carrito sin tocar el build.

---

## 💳 Puntos de Integración Mercado Pago (Checkout Pro)

El componente `MercadoPagoCarouselComponent` incluye comentarios y llamadas simuladas preparadas para conectar con tu backend:
1. Llamada a endpoint: `POST /api/mercadopago/crear-preferencia` pasando `items` y `cliente`.
2. Redirección al `init_point` retornado por la API de Mercado Pago.
3. Recepción en pantalla de confirmación mediante `back_urls`.
