import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { HOME_IMAGES } from '../../core/data/images.data';
import { Parallax } from '../../shared/directives/parallax';
import { Icon } from '../../shared/ui/icon';
import { ProductCard } from '../../shared/ui/product-card';
import { HeroCarousel } from './hero-carousel';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, HeroCarousel, ProductCard, Icon, Parallax],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly images = HOME_IMAGES;
  private readonly svc = inject(ProductService);

  protected readonly categories = this.svc.categories;
  protected readonly bestsellers = this.svc.bestsellers(8);
  protected readonly novelties = this.svc.products.filter(p => p.isNew).slice(0, 4);

  protected readonly benefits = [
    { title: 'Оригинальная продукция', text: 'Работаем только с проверенными брендами.' },
    { title: 'Бесплатная доставка', text: 'При заказе от 3 000 ₽ по всей России.' },
    { title: 'Пробники в подарок', text: 'Добавляем миниатюры к каждому заказу.' },
  ];

  // viewChild — ссылка на элемент шаблона с пометкой #strip
  private readonly strip = viewChild.required<ElementRef<HTMLElement>>('strip');

  private interactionUntil = 0;
  private stripFocused = false;

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const timer = setInterval(() => {
        const el = this.strip().nativeElement;
        const rect = el.getBoundingClientRect();
        if (window.innerWidth >= 768 || document.hidden || this.stripFocused || Date.now() < this.interactionUntil ||
            matchMedia('(prefers-reduced-motion: reduce)').matches || rect.bottom < 0 || rect.top > innerHeight) return;
        const end = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= end - 2) el.scrollTo({ left: 0, behavior: 'instant' });
        else this.scrollStrip(1, false);
      }, 3500);
      destroy.onDestroy(() => clearInterval(timer));
    });
  }
  protected pauseStrip(): void { this.interactionUntil = Date.now() + 8000; }
  protected focusStrip(event: FocusEvent): void {
    this.stripFocused = event.type === 'focusin' || (event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null);
  }
  protected scrollStrip(dir: 1 | -1, manual = true): void {
    const el = this.strip().nativeElement;
    if (manual) this.pauseStrip();
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return;
    const stride = first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap);
    const visible = Math.max(1, Math.round((el.clientWidth + 16) / stride));
    const index = Math.round(el.scrollLeft / stride) + dir * (window.innerWidth < 768 ? 1 : visible);
    const left = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, index * stride));
    el.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
}