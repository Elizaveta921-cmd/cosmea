import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="mt-24 bg-ink text-cream/80">
      <div class="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p class="font-display text-3xl text-cream">Cosmea</p>
          <p class="mt-3 max-w-xs text-sm">
            Косметика, к которой хочется возвращаться. Учебный проект: демонстрационный магазин без серверной части.
          </p>
        </div>
        <nav class="flex flex-col gap-2 text-sm" aria-label="Навигация в подвале">
          <a routerLink="/catalog" class="hover:text-cream">Каталог</a>
          <a routerLink="/favorites" class="hover:text-cream">Избранное</a>
          <a routerLink="/cart" class="hover:text-cream">Корзина</a>
        </nav>
        <div class="text-sm">
          <p>Доставка по всей России</p>
          <p class="mt-2">Бесплатно от 3 000 ₽</p>
          <p class="mt-2">hello&#64;cosmea.demo</p>
        </div>
      </div>
      <div class="border-t border-cream/10 py-4 text-center text-xs">© {{ year }} Cosmea</div>
    </footer>
  `,
})
export class Footer {
  protected readonly year = new Date().getFullYear();
}