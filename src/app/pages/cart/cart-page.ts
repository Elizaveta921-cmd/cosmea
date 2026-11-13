import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { Icon } from '../../shared/ui/icon';
import { CartControl } from '../../shared/ui/cart-control';

const FREE_DELIVERY_FROM = 3000;
const DELIVERY_PRICE = 300;

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, Icon, PricePipe, CartControl],
  templateUrl: './cart-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {
  protected readonly cart = inject(CartService);
  protected readonly ordered = signal(false);

  protected readonly delivery = computed(() => {
    const total = this.cart.total();
    return total === 0 || total >= FREE_DELIVERY_FROM ? 0 : DELIVERY_PRICE;
  });
  protected readonly grandTotal = computed(() => this.cart.total() + this.delivery());
    protected readonly deliveryLabel = computed(() => (this.delivery() === 0 ? 'Бесплатно' : `${this.delivery()} ₽`));
  protected readonly toFreeDelivery = computed(() => Math.max(0, FREE_DELIVERY_FROM - this.cart.total()));

  // Демо-оформление: сервера нет, поэтому просто очищаем корзину и показываем сообщение
  protected checkout(): void {
    this.ordered.set(true);
    this.cart.clear();
  }
}