import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Icon } from './icon';

@Component({
  selector: 'app-pagination',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (totalPages() > 1) {
      <nav class="flex items-center justify-center gap-1" aria-label="Страницы каталога">
        <button type="button" [disabled]="page() === 1" (click)="pageChange.emit(page() - 1)"
                aria-label="Предыдущая страница"
                class="grid size-10 place-items-center rounded-full border border-sand bg-white hover:border-rosewood disabled:cursor-not-allowed disabled:opacity-40">
          <app-icon name="chevron-left" class="size-4" />
        </button>

        @for (it of items(); track $index) {
          @if (it === 0) {
            <span class="px-1 text-ink/40">…</span>
          } @else {
            <button type="button" (click)="pageChange.emit(it)"
                    [attr.aria-current]="it === page() ? 'page' : null"
                    class="grid size-10 place-items-center rounded-full border text-sm transition"
                    [class.border-rosewood]="it === page()"
                    [class.bg-rosewood]="it === page()"
                    [class.text-white]="it === page()"
                    [class.border-sand]="it !== page()"
                    [class.bg-white]="it !== page()"
                    [class.hover:border-rosewood]="it !== page()">
              {{ it }}
            </button>
          }
        }

        <button type="button" [disabled]="page() === totalPages()" (click)="pageChange.emit(page() + 1)"
                aria-label="Следующая страница"
                class="grid size-10 place-items-center rounded-full border border-sand bg-white hover:border-rosewood disabled:cursor-not-allowed disabled:opacity-40">
          <app-icon name="chevron-right" class="size-4" />
        </button>
      </nav>
    }
  `,
})
export class Pagination {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();   // «событие наружу»: родитель слушает (pageChange)="..."

  // Список для отрисовки: числа страниц, а 0 означает «…»
  protected readonly items = computed<number[]>(() => {
    const total = this.totalPages();
    const cur = this.page();
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [...new Set([1, total, cur - 1, cur, cur + 1])]
      .filter(p => p >= 1 && p <= total)
      .sort((a, b) => a - b);

    const result: number[] = [];
    pages.forEach((p, i) => {
      if (i > 0) {
        const gap = p - pages[i - 1];
        if (gap === 2) result.push(p - 1);   // пропущена одна страница: покажем её
        else if (gap > 2) result.push(0);    // пропущено много: многоточие
      }
      result.push(p);
    });
    return result;
  });
}