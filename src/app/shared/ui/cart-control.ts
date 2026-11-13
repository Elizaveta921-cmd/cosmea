import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Icon } from './icon';

@Component({
  selector: 'app-cart-control',
  imports: [Icon],
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (qty() > 0) {
      <div class="flex h-11 w-full items-center justify-between rounded-full border border-rosewood/30 bg-blush/30 text-ink"
           role="group" [attr.aria-label]="'Количество в корзине: ' + productName()">
        <button type="button" (click)="cart.setQty(productId(), qty() - 1)"
                [attr.aria-label]="'Уменьшить количество: ' + productName()"
                class="grid size-11 shrink-0 place-items-center rounded-full transition hover:bg-blush">
          <app-icon name="minus" class="size-4" />
        </button>
        <span class="min-w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite" aria-atomic="true">{{ qty() }} шт.</span>
        <button type="button" (click)="cart.add(productId())" [disabled]="qty() >= cart.maxQty"
                [attr.aria-label]="'Увеличить количество: ' + productName()"
                class="grid size-11 shrink-0 place-items-center rounded-full transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-30">
          <app-icon name="plus" class="size-4" />
        </button>
      </div>
    } @else {
      <button type="button" (click)="cart.add(productId())"
              [attr.aria-label]="'Добавить в корзину: ' + productName()"
              class="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-3 text-sm font-medium text-cream transition hover:bg-rosewood">
        <app-icon name="bag" class="size-4" /> В корзину
      </button>
    }
  `,
})
export class CartControl {
  readonly productId = input.required<number>();
  readonly productName = input('товар');
  protected readonly cart = inject(CartService);
  protected readonly qty = computed(() => this.cart.quantity(this.productId()));
}
