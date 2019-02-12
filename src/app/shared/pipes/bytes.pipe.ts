import { Pipe, PipeTransform } from '@angular/core';

export type ByteUnit = 'B' | 'kB' | 'KB' | 'MB' | 'GB' | 'TB';


@Pipe({
  name: 'bytes'
})
export class BytesPipe implements PipeTransform {

  static formats: { [key: string]: { max: number, prev?: ByteUnit } } = {
    'B': { max: 1024 },
    'kB': { max: Math.pow(1024, 2), prev: 'B' },
    'KB': { max: Math.pow(1024, 2), prev: 'B' }, // Backward compatible
    'MB': { max: Math.pow(1024, 3), prev: 'kB' },
    'GB': { max: Math.pow(1024, 4), prev: 'MB' },
    'TB': { max: Number.MAX_SAFE_INTEGER, prev: 'GB' }
  };

  static formatResult(result: number, unit: string): string {
    return `${result} ${unit}`;
  }

  static calculateResult(format: { max: number, prev?: ByteUnit }, bytes: number) {
    const prev = format.prev ? BytesPipe.formats[format.prev] : undefined;
    return prev ? bytes / prev.max : bytes;
  }

  transform(input: any, decimal: number = 0, from: ByteUnit = 'B', to?: ByteUnit): any {

    if (!(this.isNumberFinite(input) &&
      this.isNumberFinite(decimal) &&
      this.isInteger(decimal) &&
      this.isPositive(decimal))) {
      return input;
    }

    let bytes = input;
    let unit = from;
    while (unit !== 'B') {
      bytes *= 1024;
      // tslint:disable-next-line:no-non-null-assertion
      unit = BytesPipe.formats[unit].prev!;
    }

    if (to) {
      const format = BytesPipe.formats[to];

      const result = this.toDecimal(BytesPipe.calculateResult(format, bytes), decimal);

      return BytesPipe.formatResult(result, to);
    }

    // tslint:disable-next-line:forin
    for (const key in BytesPipe.formats) {
      const format = BytesPipe.formats[key];
      if (bytes < format.max) {

        const result = this.toDecimal(BytesPipe.calculateResult(format, bytes), decimal);

        return BytesPipe.formatResult(result, key);
      }
    }
  }

  private isNumberFinite(value: any): value is number {
    return this.isNumber(value) && isFinite(value);
  }

  private isNumber(value: any): value is number {
    return typeof value === 'number';
  }

  private isPositive(value: number): boolean {
    return value >= 0;
  }

  private isInteger(value: number): boolean {
    // No rest, is an integer
    return (value % 1) === 0;
  }

  private toDecimal(value: number, decimal: number): number {
    return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }

}
