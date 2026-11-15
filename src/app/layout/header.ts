import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../core/services/cart.service';
import { FavoritesService } from '../core/services/favorites.service';
import { Icon } from '../shared/ui/icon';
import { SearchBox } from './search-box';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon, SearchBox],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const header = this.host.nativeElement.querySelector('header');
      if (!header) return;
      const update = () => document.documentElement.style.setProperty('--site-header-height', header.getBoundingClientRect().height + 'px');
      const observer = new ResizeObserver(update);
      observer.observe(header);
      update();
      destroy.onDestroy(() => observer.disconnect());
    });
  }
  protected readonly favorites = inject(FavoritesService);
  protected readonly cart = inject(CartService);
}