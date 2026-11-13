import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { loadJson, saveJson } from '../utils/storage';
import { ProductService } from './product.service';

export interface CartItem { productId: number; qty: number; }
export interface CartLine { product: Product; qty: number; sum: number; }

const KEY = 'cosmea:cart';
const MAX_QTY = 99;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly products = inject(ProductService);
  readonly maxQty = MAX_QTY;
  private readonly _items = signal<CartItem[]>(this.restore());

  private restore(): CartItem[] {
    const raw = loadJson<unknown>(KEY, []);
    if (!Array.isArray(raw)) return [];
    const quantities = new Map<number, number>();
    for (const item of raw) {
      if (item && this.products.getById(item.productId) && Number.isFinite(item.qty) && item.qty >= 1) {
        quantities.set(item.productId, Math.min(MAX_QTY, (quantities.get(item.productId) ?? 0) + Math.floor(item.qty)));
      }
    }
    return [...quantities].map(([productId, qty]) => ({ productId, qty }));
  }

  /** Строки корзины вместе с данными товара и суммой */
  readonly lines = computed<CartLine[]>(() =>
    this._items().flatMap(item => {
      const product = this.products.getById(item.productId);
      return product ? [{ product, qty: item.qty, sum: product.price * item.qty }] : [];
    }),
  );
  readonly count = computed(() => this._items().reduce((s, i) => s + i.qty, 0));
  readonly total = computed(() => this.lines().reduce((s, l) => s + l.sum, 0));

  constructor() {
    effect(() => saveJson(KEY, this._items()));
  }

  quantity(id: number): number {
    return this._items().find(i => i.productId === id)?.qty ?? 0;
  }

  has(id: number): boolean {
    return this._items().some(i => i.productId === id);
  }

  add(id: number, qty = 1): void {
    if (!this.products.getById(id) || !Number.isFinite(qty) || qty < 1) return;
    qty = Math.min(MAX_QTY, Math.floor(qty));
    this._items.update(items =>
      items.some(i => i.productId === id)
        ? items.map(i => (i.productId === id ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i))
        : [...items, { productId: id, qty }],
    );
  }

  setQty(id: number, qty: number): void {
    if (!Number.isFinite(qty)) return;
    qty = Math.floor(qty);
    if (qty < 1) {
      this.remove(id);
      return;
    }
    this._items.update(items =>
      items.map(i => (i.productId === id ? { ...i, qty: Math.min(qty, MAX_QTY) } : i)),
    );
  }

  remove(id: number): void {
    this._items.update(items => items.filter(i => i.productId !== id));
  }

  clear(): void {
    this._items.set([]);
  }
}