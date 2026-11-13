import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { ProductService } from '../../core/services/product.service';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { Icon } from '../../shared/ui/icon';
import { ProductCard } from '../../shared/ui/product-card';
import { CartControl } from '../../shared/ui/cart-control';
import { ProductGallery } from './product-gallery';

@Component({
  selector: 'app-product-page',
  imports: [RouterLink, ProductGallery, ProductCard, Icon, PricePipe, CartControl],
  templateUrl: './product-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPage {
  private readonly products = inject(ProductService);
  protected readonly favorites = inject(FavoritesService);
  protected readonly cart = inject(CartService);

  // Параметр :id из URL попадает сюда (withComponentInputBinding)
  readonly id = input<string>();

  protected readonly product = computed(() => this.products.getById(Number(this.id())));
  protected readonly categoryLabel = computed(() => {
    const p = this.product();
    return p ? this.products.categoryLabel(p.category) : '';
  });
  protected readonly discount = computed(() => {
    const p = this.product();
    return p?.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  });
  protected readonly ratingRounded = computed(() => Math.round(this.product()?.rating ?? 0));
  protected readonly similar = computed(() => {
    const p = this.product();
    return p ? this.products.similar(p) : [];
  });

  protected readonly stars = [1, 2, 3, 4, 5];
}
