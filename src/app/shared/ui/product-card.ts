import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { CartControl } from './cart-control';
import { ProductPreviewService } from '../../core/services/product-preview.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { PricePipe } from '../pipes/price.pipe';
import { Icon } from './icon';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, Icon, PricePipe, CartControl],
  templateUrl: './product-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();   // родитель передаёт товар: <app-product-card [product]="p" />

  protected readonly favorites = inject(FavoritesService);
  protected readonly preview = inject(ProductPreviewService);

  // Размер скидки в %, считается автоматически
  protected readonly discount = computed(() => {
    const p = this.product();
    return p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  });
}