import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TiendaConfig } from '../models/tienda.model';
import { CarritoItem } from '../models/carrito.model';
import { ClienteDatos } from '../models/checkout.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  /**
   * Genera y descarga un presupuesto profesional en PDF utilizando jsPDF y autoTable.
   */
  generarPresupuestoPdf(
    tienda: TiendaConfig,
    cliente: ClienteDatos,
    items: CarritoItem[],
    total: number,
    numeroPresupuesto?: string
  ): string {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const numero = numeroPresupuesto || `PRE-${tienda.slug.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString(tienda.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const fechaVencimiento = new Date(fecha.getTime() + (tienda.pdfConfig.validezDias || 7) * 24 * 60 * 60 * 1000);
    const fechaVencimientoStr = fechaVencimiento.toLocaleDateString(tienda.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Formateador de moneda
    const formatter = new Intl.NumberFormat(tienda.locale, {
      style: 'currency',
      currency: tienda.moneda,
      maximumFractionDigits: 2
    });

    // --- ENCABEZADO ---
    // Barra superior de acento con color primario de la tienda
    doc.setFillColor(tienda.colores.primario);
    doc.rect(0, 0, 210, 8, 'F');

    // Nombre de la tienda
    doc.setTextColor(tienda.colores.primario);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(tienda.nombre.toUpperCase(), 14, 22);

    // Rubro y Slogan
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(90, 100, 115);
    doc.text(tienda.rubro, 14, 28);
    doc.text(tienda.pdfConfig.domicilioFiscal || tienda.info.direccion, 14, 33);
    doc.text(`CUIT: ${tienda.pdfConfig.cuit} | ${tienda.pdfConfig.contacto}`, 14, 38);

    // Tarjeta derecha: Datos de Presupuesto
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(120, 14, 76, 28, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(tienda.colores.primario);
    doc.text('PRESUPUESTO FORMAL', 124, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 70, 85);
    doc.text(`N°: ${numero}`, 124, 26);
    doc.text(`Fecha: ${fechaStr}`, 124, 31);
    doc.text(`Validez: ${tienda.pdfConfig.validezDias || 7} días (${fechaVencimientoStr})`, 124, 36);

    // Línea separadora
    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.5);
    doc.line(14, 46, 196, 46);

    // --- DATOS DEL CLIENTE ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(tienda.colores.primario);
    doc.text('DATOS DEL DESTINATARIO', 14, 53);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(45, 55, 72);

    doc.text(`Cliente / Razón Social: ${cliente.nombre}`, 14, 59);
    doc.text(`Correo Electrónico: ${cliente.email}`, 14, 64);
    doc.text(`Teléfono / WhatsApp: ${cliente.telefono}`, 115, 59);

    if (cliente.direccionEntrega) {
      doc.text(`Dirección de Entrega: ${cliente.direccionEntrega}`, 115, 64);
    }

    if (cliente.observaciones) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 110, 125);
      doc.text(`Observaciones: ${cliente.observaciones}`, 14, 70);
    }

    // --- TABLA DE ITEMS CON AUTOTABLE ---
    const startY = cliente.observaciones ? 76 : 70;

    const tableRows = items.map((item, idx) => {
      const unitario = item.producto.precio;
      const subtotalItem = unitario * item.cantidad;
      return [
        (idx + 1).toString(),
        item.producto.codigo,
        `${item.producto.nombre}\n${item.producto.descripcion.slice(0, 90)}`,
        item.cantidad.toString(),
        formatter.format(unitario),
        formatter.format(subtotalItem)
      ];
    });

    autoTable(doc, {
      startY,
      head: [['#', 'Código', 'Descripción del Producto', 'Cant.', 'Precio Unit.', 'Subtotal']],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59], // o color primario parseado
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center'
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 3,
        valign: 'middle'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'center', cellWidth: 24, fontStyle: 'bold' },
        2: { cellWidth: 84 },
        3: { halign: 'center', cellWidth: 16 },
        4: { halign: 'right', cellWidth: 24 },
        5: { halign: 'right', cellWidth: 24, fontStyle: 'bold' }
      }
    });

    // Obtenemos posición final de la tabla
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 140;

    // --- RECUADRO DE TOTALES ---
    const totalBoxY = finalY + 8;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(120, totalBoxY, 76, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 90, 105);
    doc.text('Total Presupuesto:', 124, totalBoxY + 8);
    doc.text(`Moneda de cotización: ${tienda.moneda}`, 124, totalBoxY + 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(tienda.colores.primario);
    doc.text(formatter.format(total), 192, totalBoxY + 18, { align: 'right' });

    // --- CONDICIONES Y LEYENDAS LEGALES ---
    const legalY = totalBoxY + 34;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(tienda.colores.primario);
    doc.text('CONDICIONES COMERCIALES Y VALIDEZ:', 14, legalY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(110, 120, 135);
    const splitLeyenda = doc.splitTextToSize(
      `${tienda.pdfConfig.leyendas} Para confirmar esta cotización o coordinar entrega, comunicarse a ${tienda.info.email} o por WhatsApp al +${tienda.info.whatsapp}.`,
      182
    );
    doc.text(splitLeyenda, 14, legalY + 5);

    // --- PIE DE PÁGINA ---
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(160, 170, 185);
    doc.text(
      `Generado automáticamente por plataforma de presupuestos para ${tienda.nombre} - ${fecha.toLocaleDateString()}`,
      105,
      288,
      { align: 'center' }
    );

    // Descarga automática
    const filename = `Presupuesto_${tienda.slug}_${numero}.pdf`;
    doc.save(filename);

    return numero;
  }
}
