import { Injectable, effect, inject, signal } from '@angular/core';
import { loadJson, saveJson } from '../utils/storage';
import { ProductService } from './product.service';

const KEY = 'cosmea:search-history';
const LIMIT = 8;
const STOP_WORDS = new Set(['для', 'под', 'при', 'без', 'или', 'снятия']);
const key = (value: string): string => value.normalize('NFC').toLocaleLowerCase('ru');

@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
  private readonly products = inject(ProductService);
  // Complete catalog words, category labels and brand names, rather than arbitrary user fragments.
  private readonly vocabulary = this.buildVocabulary();
  private readonly entries = signal<string[]>(this.restore());
  readonly items = this.entries.asReadonly();

  constructor() { effect(() => saveJson(KEY, this.entries())); }

  private buildVocabulary(): Map<string, { label: string; count: number }> {
    const words = new Map<string, { label: string; count: number }>();
    const add = (label: string): void => {
      const normalized = key(label);
      if (normalized.length < 3 || STOP_WORDS.has(normalized)) return;
      const previous = words.get(normalized);
      words.set(normalized, { label, count: (previous?.count ?? 0) + 1 });
    };
    for (const product of this.products.products) {
      for (const word of key(product.name).match(/[\p{L}][\p{L}\p{N}-]*/gu) ?? []) add(word);
      add(product.name);
    }
    for (const category of this.products.categories) add(category.label);
    for (const brand of this.products.brands) add(brand);
    return words;
  }

  private normalize(value: string): string | null {
    const product = this.productFor(value);
    if (product) return product.name;
    const query = key(value.trim().replace(/\s+/g, ' '));
    if (query.length < 2 || query.length > 120 || STOP_WORDS.has(query) ||
        !/^[\p{L}\p{N}]+(?:[ -][\p{L}\p{N}]+)*$/u.test(query) ||
        !/\p{L}/u.test(query) || !this.products.search(query).length) return null;

    const exact = this.vocabulary.get(query);
    if (exact) return exact.label;

    // A single word completes to a whole word; phrases and brand names complete as a unit.
    const phrase = query.includes(' ');
    const candidates = [...this.vocabulary.entries()]
      .filter(([term]) => term.startsWith(query) && (phrase || !term.includes(' ') ||
        this.products.brands.some(brand => key(brand) === term) ||
        this.products.categories.some(category => key(category.label) === term)))
      .map(([, candidate]) => candidate)
      .sort((a, b) => b.count - a.count);

    if (!candidates.length) return null;
    // Do not guess between equally likely catalog words.
    if (candidates.length > 1 && candidates[0].count === candidates[1].count) return null;
    return candidates[0].label;
  }

  private restore(): string[] {
    const raw = loadJson<unknown>(KEY, []);
    if (!Array.isArray(raw)) return [];
    const normalized = raw.filter((q): q is string => typeof q === 'string')
      .map(q => this.normalize(q)).filter((q): q is string => q !== null);
    return [...new Map(normalized.map(q => [key(q), q])).values()].slice(0, LIMIT);
  }

  remember(value: string): void {
    const query = this.normalize(value);
    if (!query) return;
    this.entries.update(list => [query, ...list.filter(q => key(q) !== key(query))].slice(0, LIMIT));
  }
  productFor(value: string) {
    return this.products.products.find(product => key(product.name) === key(value.trim()));
  }
  rememberProduct(id: number): void {
    const product = this.products.getById(id);
    if (product) this.remember(product.name);
  }
  remove(query: string): void { this.entries.update(list => list.filter(q => q !== query)); }
  clear(): void { this.entries.set([]); }
}
