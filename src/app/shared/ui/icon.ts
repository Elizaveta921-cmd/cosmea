import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'heart' | 'bag' | 'search' | 'arrow-left' | 'chevron-left' | 'chevron-right'
  | 'trash' | 'close' | 'plus' | 'minus' | 'star' | 'check'
  | 'sort' | 'sliders' | 'grid-four' | 'grid-six' | 'home' | 'clock' | 'eye';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block shrink-0' },
  template: `
    <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6"
         stroke-linecap="round" stroke-linejoin="round" class="size-full" aria-hidden="true"
         [attr.fill]="filled() ? 'currentColor' : 'none'">
      @switch (name()) {
        @case ('sort') { <path d="M8 4v16M4 8l4-4 4 4M16 20V4M12 16l4 4 4-4"/> }
        @case ('sliders') { <path d="M4 7h6m4 0h6M4 17h10m4 0h2"/><circle cx="12" cy="7" r="2"/><circle cx="16" cy="17" r="2"/> }
        @case ('grid-four') { <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/> }
        @case ('grid-six') { <rect x="2" y="3" width="5" height="7" rx="1"/><rect x="9.5" y="3" width="5" height="7" rx="1"/><rect x="17" y="3" width="5" height="7" rx="1"/><rect x="2" y="14" width="5" height="7" rx="1"/><rect x="9.5" y="14" width="5" height="7" rx="1"/><rect x="17" y="14" width="5" height="7" rx="1"/> }
        @case ('home') { <path d="m3 10 9-7 9 7v10H3zM9 20v-7h6v7"/> }
        @case ('clock') { <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/> }
        @case ('eye') { <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/> }
        @case ('heart') { <path d="M12 20.5s-8-4.6-8-11A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 6.4-8 11-8 11z"/> }
        @case ('bag') { <path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/> }
        @case ('search') { <circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/> }
        @case ('arrow-left') { <path d="M19 12H5M11 6l-6 6 6 6"/> }
        @case ('chevron-left') { <path d="M15 5l-7 7 7 7"/> }
        @case ('chevron-right') { <path d="M9 5l7 7-7 7"/> }
        @case ('trash') { <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/> }
        @case ('close') { <path d="M6 6l12 12M18 6L6 18"/> }
        @case ('plus') { <path d="M12 5v14M5 12h14"/> }
        @case ('minus') { <path d="M5 12h14"/> }
        @case ('check') { <path d="M5 12.5l4.5 4.5L19 7.5"/> }
        @case ('star') { <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5z"/> }
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();   // входной параметр: <app-icon name="heart" />
  readonly filled = input(false);               // <app-icon name="heart" [filled]="true" />
}