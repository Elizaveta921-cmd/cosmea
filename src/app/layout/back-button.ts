import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationService } from '../core/services/navigation.service';
import { Icon } from '../shared/ui/icon';

@Component({
  selector: 'app-back-button',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="back()"
            class="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white px-3 py-1.5 text-sm hover:border-rosewood hover:text-rosewood">
      <app-icon name="arrow-left" class="size-4" /> Назад
    </button>
  `,
})
export class BackButton {
  private readonly navigation = inject(NavigationService);

  back(): void { this.navigation.back(); }
}
