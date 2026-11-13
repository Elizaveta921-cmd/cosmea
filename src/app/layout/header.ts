import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  protected readonly favorites = inject(FavoritesService);
  protected readonly cart = inject(CartService);
}