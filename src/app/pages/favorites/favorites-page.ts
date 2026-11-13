import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { ProductCard } from '../../shared/ui/product-card';

@Component({
  selector: 'app-favorites-page',
  imports: [RouterLink, ProductCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-7xl px-4 py-10">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <h1 class="font-display text-5xl">Избранное</h1>
        @if (favorites.count() > 0) {
          <button type="button" (click)="favorites.clear()"
                  class="text-sm text-ink/60 underline underline-offset-4 hover:text-rosewood">
            Очистить список
          </button>
        }
      </div>

      @if (favorites.count() > 0) {
        <div class="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          @for (p of favorites.items(); track p.id) {
            <app-product-card [product]="p" />
          }
        </div>
      } @else {
        <div class="mt-10 rounded-3xl border border-dashed border-sand py-20 text-center">
          <p class="font-display text-3xl">Пока пусто</p>
          <p class="mt-2 text-sm text-ink/60">Нажмите на сердечко у товара, чтобы сохранить его здесь.</p>
          <a routerLink="/catalog"
             class="mt-6 inline-block rounded-full bg-ink px-7 py-3 text-sm text-cream hover:bg-rosewood">
            Перейти в каталог
          </a>
        </div>
      }
    </section>
  `,
})
export class FavoritesPage {
  protected readonly favorites = inject(FavoritesService);
}