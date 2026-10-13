import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'precio',
  standalone: true
})
export class PrecioPipe implements PipeTransform {
  /**
   * Formatea un número como moneda según el locale y moneda especificados (por defecto 'ARS' y 'es-AR')
   */
  transform(valor: number | null | undefined, locale: string = 'es-AR', moneda: string = 'ARS'): string {
    if (valor === null || valor === undefined || isNaN(valor)) {
      valor = 0;
    }

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: moneda,
        maximumFractionDigits: 0
      }).format(valor);
    } catch {
      return `$ ${valor.toLocaleString('es-AR')}`;
    }
  }
}
