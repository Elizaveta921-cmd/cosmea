import { Pipe, PipeTransform } from '@angular/core';

// Пайп — функция форматирования прямо в шаблоне: {{ 2490 | price }} → «2 490 ₽»
@Pipe({ name: 'price' })
export class PricePipe implements PipeTransform {
  private readonly fmt = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  });

  transform(value: number): string {
    return this.fmt.format(value);
  }
}