import { Injectable, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductPreviewService {
  private readonly selected = signal<Product | null>(null);
  readonly product = this.selected.asReadonly();
  constructor() {
    inject(Router).events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart) this.close();
    });
  }
  open(product: Product): void { this.selected.set(product); }
  close(): void { this.selected.set(null); }
}
