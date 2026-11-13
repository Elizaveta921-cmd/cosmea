import { Injectable } from '@angular/core';
import { CATEGORIES, PRODUCTS } from '../data/products.data';
import { CategoryId, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  readonly products: readonly Product[] = PRODUCTS;
  readonly categories = CATEGORIES;
  readonly brands = [...new Set(PRODUCTS.map(p => p.brand))].sort();
  readonly maxPrice = Math.max(...PRODUCTS.map(p => p.price));

  getById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  categoryLabel(id: CategoryId): string {
    return this.categories.find(c => c.id === id)?.label ?? '';
  }

  /** Поиск по названию, бренду и категории. Пустой запрос — все товары. */
  search(query: string): Product[] {
    const q = query.trim().toLowerCase();
    if (!q) return [...this.products];
    return this.products.filter(p =>
      `${p.name} ${p.brand} ${this.categoryLabel(p.category)}`.toLowerCase().includes(q),
    );
  }

  bestsellers(limit: number): Product[] {
    return [...this.products].sort((a, b) => b.reviews - a.reviews).slice(0, limit);
  }

  similar(product: Product, limit = 4): Product[] {
    return this.products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
  }
}