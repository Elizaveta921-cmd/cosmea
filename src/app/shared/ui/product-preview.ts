import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { ProductPreviewService } from '../../core/services/product-preview.service';
import { PricePipe } from '../pipes/price.pipe';
import { ProductGallery } from '../../pages/product/product-gallery';
import { CartControl } from './cart-control';
import { Icon } from './icon';

@Component({
  selector: 'app-product-preview',
  imports: [RouterLink, ProductGallery, CartControl, Icon, PricePipe],
  host: { '(window:resize)': 'onResize()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dialog class="product-preview" aria-labelledby="preview-title" (click)="backdrop($event)" (cancel)="preview.close()" (close)="preview.close()">
      @if (preview.product(); as p) {
        <div class="relative max-h-[90dvh] overflow-y-auto bg-cream p-7">
          <button type="button" autofocus (click)="preview.close()" aria-label="Закрыть предпросмотр"
                  class="absolute right-3 top-3 z-20 grid size-10 place-items-center rounded-full bg-white shadow-sm hover:bg-sand"><app-icon name="close" class="size-5" /></button>
          <div class="grid gap-8 md:grid-cols-2">
            <div class="relative min-w-0">
              <app-product-gallery [images]="p.images" [alt]="p.name" />
              <button type="button" (click)="favorites.toggle(p.id)" [attr.aria-pressed]="favorites.has(p.id)"
                      [attr.aria-label]="favorites.has(p.id) ? 'Убрать из избранного' : 'Добавить в избранное'"
                      [class.text-rosewood]="favorites.has(p.id)"
                      class="absolute right-3 top-3 grid size-11 place-items-center rounded-full border border-sand bg-white/95 shadow-sm"><app-icon name="heart" class="size-5" [filled]="favorites.has(p.id)" /></button>
            </div>
            <div class="flex flex-col py-4">
              <p class="text-xs uppercase tracking-widest text-ink/50">{{ p.brand }}</p>
              <h2 id="preview-title" class="mt-2 pr-2 font-display text-4xl">{{ p.name }}</h2>
              <p class="mt-3 flex items-center gap-2 text-sm text-ink/60"><app-icon name="star" class="size-4 text-rosewood" [filled]="true" /> {{ p.rating }} · {{ p.reviews }} отзывов</p>
              <div class="mt-6 flex items-baseline gap-3"><span class="text-3xl font-semibold">{{ p.price | price }}</span>@if (p.oldPrice) { <span class="text-ink/40 line-through">{{ p.oldPrice | price }}</span> }</div>
              <p class="mt-2 text-sm text-ink/50">{{ p.volume }}</p>
              <p class="mt-6 text-sm leading-relaxed text-ink/75">{{ p.description }}</p>
              <app-cart-control class="mt-7" [productId]="p.id" [productName]="p.name" />
              <a [routerLink]="['/catalog', p.id]" (click)="preview.close()" class="mt-4 rounded-full border border-sand px-5 py-3 text-center text-sm hover:border-rosewood">Подробнее о товаре</a>
            </div>
          </div>
        </div>
      }
    </dialog>
  `,
})
export class ProductPreview {
  protected readonly preview = inject(ProductPreviewService);
  protected readonly favorites = inject(FavoritesService);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  constructor() {
    effect(() => {
      const dialog = this.dialog()?.nativeElement;
      if (!dialog) return;
      if (this.preview.product() && !dialog.open) dialog.showModal();
      else if (!this.preview.product() && dialog.open) dialog.close();
    });
  }
  protected backdrop(event: MouseEvent): void { if (event.target === event.currentTarget) this.preview.close(); }
  protected onResize(): void { if (window.innerWidth < 1024) this.preview.close(); }
}
