import { Injectable, effect, inject, signal } from '@angular/core';
import { loadJson, saveJson } from '../utils/storage';
import { ProductService } from './product.service';

const KEY = 'cosmea:search-history';
const LIMIT = 8;
@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
  private readonly products = inject(ProductService);
  private readonly entries = signal<string[]>(this.restore());
  readonly items = this.entries.asReadonly();

  constructor() { effect(() => saveJson(KEY, this.entries())); }
  private restore(): string[] {
    const raw = loadJson<unknown>(KEY, []);
    if (!Array.isArray(raw)) return [];
    return [...new Map(raw.filter((q): q is string => typeof q === 'string' && !!q.trim())
      .map(q => [q.trim().toLocaleLowerCase('ru'), q.trim().slice(0, 120)])).values()].filter(q => this.products.search(q).length > 0).slice(0, LIMIT);
  }
  remember(value: string): void {
    const query = value.trim().slice(0, 120);
    if (!query || this.products.search(value.trim()).length === 0) return;
    this.entries.update(list => [query, ...list.filter(q => q.toLocaleLowerCase('ru') !== query.toLocaleLowerCase('ru'))].slice(0, LIMIT));
  }
  remove(query: string): void { this.entries.update(list => list.filter(q => q !== query)); }
  clear(): void { this.entries.set([]); }
}
