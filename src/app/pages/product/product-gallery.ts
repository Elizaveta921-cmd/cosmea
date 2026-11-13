import { ChangeDetectionStrategy, Component, computed, effect, input, signal, untracked } from '@angular/core';
import { Icon } from '../../shared/ui/icon';

@Component({
  selector: 'app-product-gallery',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-3 outline-none" tabindex="0"
         (keydown.arrowLeft)="prev()" (keydown.arrowRight)="next()">

      <div class="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white"
           (touchstart)="onTouchStart($event)" (touchend)="onTouchEnd($event)">
        <div class="flex h-full transition-transform duration-500 ease-out"
             [style.transform]="'translateX(-' + current() * 100 + '%)'">
          @for (src of images(); track src; let i = $index) {
            <img [src]="src" [alt]="alt() + ' — фото ' + (i + 1)" class="size-full shrink-0 object-contain p-4" />
          }
        </div>

        @if (images().length > 1) {
          <button type="button" (click)="prev()" aria-label="Предыдущее фото"
                  class="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 hover:bg-white">
            <app-icon name="chevron-left" class="size-5" />
          </button>
          <button type="button" (click)="next()" aria-label="Следующее фото"
                  class="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 hover:bg-white">
            <app-icon name="chevron-right" class="size-5" />
          </button>
          <span class="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-xs text-cream">
            {{ current() + 1 }} / {{ images().length }}
          </span>
        }
      </div>

      @if (images().length > 1) {
        <div class="flex gap-2 overflow-x-auto">
          @for (src of images(); track src; let i = $index) {
            <button type="button" (click)="index.set(i)" [attr.aria-label]="'Показать фото ' + (i + 1)"
                    class="size-20 shrink-0 overflow-hidden rounded-xl border-2 transition"
                    [class.border-rosewood]="i === current()"
                    [class.border-transparent]="i !== current()">
              <img [src]="src" alt="" class="size-full bg-white object-contain p-1" />
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class ProductGallery {
  readonly images = input.required<string[]>();
  readonly alt = input('');

  protected readonly index = signal(0);
  // current защищает от выхода за границы массива
  protected readonly current = computed(() =>
    Math.min(this.index(), Math.max(0, this.images().length - 1)),
  );
  private touchX = 0;

  constructor() {
    // Перешли на другой товар (компонент тот же, данные новые): возвращаемся к первому фото
    effect(() => {
      this.images();
      untracked(() => this.index.set(0));
    });
  }

  protected next(): void {
    const n = this.images().length;
    this.index.set((this.current() + 1) % n);
  }
  protected prev(): void {
    const n = this.images().length;
    this.index.set((this.current() - 1 + n) % n);
  }

  protected onTouchStart(e: TouchEvent): void { this.touchX = e.changedTouches[0].clientX; }
  protected onTouchEnd(e: TouchEvent): void {
    const dx = e.changedTouches[0].clientX - this.touchX;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) this.next();
    else this.prev();
  }
}