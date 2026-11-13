import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HOME_IMAGES } from '../../core/data/images.data';

interface Slide {
  title: string;
  text: string;
  cta: string;
  query: Record<string, string>;   // параметры ссылки: /catalog?cat=face
  image: string;
}

const SLIDES: Slide[] = [
  { title: 'Сияние кожи каждый день', text: 'Сыворотки, кремы и тоники для здорового тона.',
    cta: 'Уход за лицом', query: { cat: 'face' }, image: HOME_IMAGES.face },
  { title: 'Цвет, который вам идёт', text: 'Помады, тени и румяна нового сезона.',
    cta: 'Макияж', query: { cat: 'makeup' }, image: HOME_IMAGES.makeup },
  { title: 'Ароматы с характером', text: 'Парфюмерия на каждый день и на вечер.',
    cta: 'Парфюмерия', query: { cat: 'fragrance' }, image: HOME_IMAGES.fragrance },
];

@Component({
  selector: 'app-hero-carousel',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative overflow-hidden bg-ink"
             aria-roledescription="carousel" aria-label="Главные предложения"
             (mouseenter)="paused.set(true)" (mouseleave)="paused.set(false)"
             (focusin)="paused.set(true)" (focusout)="onFocusOut($event)"
             (touchstart)="onTouchStart($event)" (touchend)="onTouchEnd($event)">

      <!-- Копии крайних слайдов обеспечивают непрерывный переход по кругу -->
      <div class="flex ease-out" [style.transition]="animated() ? 'transform 650ms ease-out' : 'none'" (transitionend)="onTransitionEnd($event)"
           [style.transform]="'translateX(-' + position() * 100 + '%)'">
        @for (s of track; track $index; let i = $index) {
          <div class="relative h-[28rem] w-full shrink-0 md:h-[34rem]"
               [attr.aria-hidden]="i !== position()"
               [attr.inert]="i !== position() ? '' : null">
            <img [src]="s.image" alt="" class="absolute inset-0 size-full object-cover" />
            <div class="absolute inset-0 bg-linear-to-r from-ink/75 via-ink/30 to-transparent"></div>

            <div class="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 text-cream">
              <p class="text-sm uppercase tracking-[0.3em] text-blush">Cosmea</p>
              <h2 class="mt-3 max-w-lg font-display text-5xl leading-tight md:text-7xl">{{ s.title }}</h2>
              <p class="mt-4 max-w-md text-cream/80">{{ s.text }}</p>
              <a routerLink="/catalog" [queryParams]="s.query"
                 class="mt-8 w-fit rounded-full bg-cream px-7 py-3 text-sm font-medium text-ink transition hover:bg-blush">
                {{ s.cta }}
              </a>
            </div>
          </div>
        }
      </div>

      <div class="absolute inset-x-0 bottom-5 flex justify-center gap-2">
        @for (s of slides; track s.title; let i = $index) {
          <button type="button" (click)="goTo(i)" [attr.aria-label]="'Слайд ' + (i + 1)"
                  class="h-2 rounded-full transition-all"
                  [class.w-8]="i === active()" [class.bg-cream]="i === active()"
                  [class.w-2]="i !== active()" [class.bg-cream/50]="i !== active()"></button>
        }
      </div>
    </section>
  `,
})
export class HeroCarousel {
  protected readonly slides = SLIDES;
  // The boundary copies let the last slide move forward naturally into the first.
  protected readonly track = [SLIDES[SLIDES.length - 1], ...SLIDES, SLIDES[0]];
  protected readonly position = signal(1);
  protected readonly active = computed(() => (this.position() - 1 + SLIDES.length) % SLIDES.length);
  protected readonly animated = signal(false);
  private moving = false;
  private pendingSlide: number | null = null;
  private settleTimer: ReturnType<typeof setTimeout> | undefined;
  private resetFrame = 0;
  protected readonly paused = signal(false);
  private touchX = 0;

  constructor() {
    // Автопрокрутка каждые 5 секунд, пока курсор не над каруселью
    const timer = setInterval(() => {
      if (!this.paused() && !document.hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) this.next();
    }, 5000);
    // Как в статье про ошибки: чистим таймер при уничтожении компонента
    inject(DestroyRef).onDestroy(() => {
      clearInterval(timer);
      clearTimeout(this.settleTimer);
      cancelAnimationFrame(this.resetFrame);
    });
  }

  protected next(): void { this.move(this.position() + 1); }
  protected prev(): void { this.move(this.position() - 1); }
  protected goTo(i: number): void {
    if (this.moving) { this.pendingSlide = i; return; }
    if (i === this.active()) return;
    const target = this.active() === SLIDES.length - 1 && i === 0 ? SLIDES.length + 1
      : this.active() === 0 && i === SLIDES.length - 1 ? 0 : i + 1;
    this.move(target);
  }
  private move(position: number): void {
    if (this.moving) return;
    this.moving = true;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.animated.set(!reduced);
    this.position.set(position);
    // A fallback also unlocks the track if a tab is hidden during its transition.
    this.settleTimer = setTimeout(() => this.settle(), reduced ? 0 : 720);
  }
  protected onTransitionEnd(event: TransitionEvent): void {
    if (event.target === event.currentTarget && event.propertyName === 'transform') this.settle();
  }
  private settle(): void {
    if (!this.moving) return;
    clearTimeout(this.settleTimer);
    this.animated.set(false);
    if (this.position() === this.track.length - 1) this.position.set(1);
    else if (this.position() === 0) this.position.set(SLIDES.length);
    this.resetFrame = requestAnimationFrame(() => {
      this.moving = false;
      const pending = this.pendingSlide;
      this.pendingSlide = null;
      if (pending !== null) this.goTo(pending);
    });
  }
  protected onFocusOut(event: FocusEvent): void {
    this.paused.set((event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null));
  }

  // Свайп на телефоне
  protected onTouchStart(e: TouchEvent): void { this.touchX = e.changedTouches[0].clientX; }
  protected onTouchEnd(e: TouchEvent): void {
    const dx = e.changedTouches[0].clientX - this.touchX;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) this.next();
    else this.prev();
  }
}