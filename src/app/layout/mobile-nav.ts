import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../core/services/cart.service';
import { FavoritesService } from '../core/services/favorites.service';
import { Icon } from '../shared/ui/icon';

@Component({
  selector: 'app-mobile-nav',
  imports: [RouterLink, RouterLinkActive, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="mobile-nav fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-sand bg-white/95 px-2 pt-2 shadow-[0_-6px_30px_#2b242508] backdrop-blur md:hidden" aria-label="Мобильное меню">
      <a routerLink="/" routerLinkActive="mobile-nav-active" [routerLinkActiveOptions]="{ exact: true }" class="mobile-nav-link"><app-icon name="home" class="size-6" /><span>Главная</span></a>
      <a routerLink="/catalog" routerLinkActive="mobile-nav-active" class="mobile-nav-link"><app-icon name="grid-four" class="size-6" /><span>Каталог</span></a>
      <a routerLink="/favorites" routerLinkActive="mobile-nav-active" class="mobile-nav-link">
        <span class="relative"><app-icon name="heart" class="size-6" />@if (favorites.count()) { <span class="mobile-nav-badge">{{ favorites.count() > 99 ? '99+' : favorites.count() }}</span> }</span><span>Избранное</span>
      </a>
      <a routerLink="/cart" routerLinkActive="mobile-nav-active" class="mobile-nav-link">
        <span class="relative"><app-icon name="bag" class="size-6" />@if (cart.count()) { <span class="mobile-nav-badge">{{ cart.count() > 99 ? '99+' : cart.count() }}</span> }</span><span>Корзина</span>
      </a>
    </nav>
  `,
})
export class MobileNav {
  protected readonly cart = inject(CartService);
  protected readonly favorites = inject(FavoritesService);
}
