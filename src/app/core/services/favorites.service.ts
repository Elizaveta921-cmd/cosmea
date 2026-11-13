import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { loadJson, saveJson } from '../utils/storage';
import { ProductService } from './product.service';

const KEY = 'cosmea:favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly products = inject(ProductService);

  // signal — «коробочка» со значением. Меняется через set/update, читается как функция: ids()
  private readonly ids = signal<number[]>(loadJson<number[]>(KEY, []));

  // computed — значение, которое пересчитывается само, когда меняются signals внутри
  readonly count = computed(() => this.ids().length);
  readonly items = computed(() =>
    this.ids()
      .map(id => this.products.getById(id))
      .filter((p): p is Product => p !== undefined),
  );

  constructor() {
    // effect — «побочное действие»: при любом изменении ids сохраняем в localStorage
    effect(() => saveJson(KEY, this.ids()));
  }

  has(id: number): boolean {
    return this.ids().includes(id);
  }

  toggle(id: number): void {
    this.ids.update(list => (list.includes(id) ? list.filter(i => i !== id) : [...list, id]));
  }

  clear(): void {
    this.ids.set([]);
  }
}