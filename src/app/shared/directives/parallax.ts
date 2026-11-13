import {
  DestroyRef, Directive, ElementRef, afterNextRender, inject, input, numberAttribute,
} from '@angular/core';

@Directive({
  selector: '[appParallax]',
  host: {
    '(window:scroll)': 'schedule()',
    '(window:resize)': 'schedule()',
  },
})
export class Parallax {
  // Использование: <img [appParallax]="0.2" />, где число задаёт силу эффекта
  readonly speed = input(0.2, { alias: 'appParallax', transform: numberAttribute });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly reduceMotion =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  private frame = 0;

  constructor() {
    afterNextRender(() => this.update());                        // выставить позицию после первого показа
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.frame));
  }

  schedule(): void {
    // requestAnimationFrame: не чаще одного пересчёта за кадр
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.update();
    });
  }

  private update(): void {
    const box = this.el.parentElement;       // «окно», внутри которого двигается картинка
    if (!box || this.reduceMotion) return;   // уважаем настройку «уменьшить анимацию»

    const rect = box.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;   // вне экрана: ничего не делаем

    // Смещение центра блока от центра экрана. Фон сдвигается на долю этого смещения
    const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
    this.el.style.transform = `translate3d(0, ${(-offset * this.speed()).toFixed(1)}px, 0)`;
  }
}