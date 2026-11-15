import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../core/models/product.model';
import { ProductService } from '../core/services/product.service';
import { SearchHistoryService } from '../core/services/search-history.service';
import { PricePipe } from '../shared/pipes/price.pipe';
import { Icon } from '../shared/ui/icon';

@Component({
  selector: 'app-search-box',
  imports: [RouterLink, Icon, PricePipe],
  templateUrl: './search-box.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:click)': 'onDocumentClick($event)', '(focusout)': 'onFocusOut($event)' },
})
export class SearchBox {
  private readonly products = inject(ProductService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly history = inject(SearchHistoryService);
  protected readonly query = signal('');
  protected readonly open = signal(false);
  protected readonly active = signal(-1);
  protected readonly hasQuery = computed(() => !!this.query().trim());
  protected readonly matches = computed(() => this.hasQuery() ? this.products.search(this.query()) : []);
  protected readonly results = computed(() => this.matches().slice(0, 5));

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.currentNavigation()?.extras.info === 'live-search') return;
        this.query.set(this.router.parseUrl(event.urlAfterRedirects).queryParams['q'] ?? '');
        this.open.set(false);
        this.active.set(-1);
      }
    });
  }
  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.open.set(true);
    this.active.set(-1);
    const catalog = this.router.url.split('?')[0] === '/catalog';
    this.router.navigate(['/catalog'], {
      queryParams: { q: this.query().trim() || null, page: null },
      ...(catalog ? { queryParamsHandling: 'merge' as const } : {}),
      replaceUrl: catalog, info: 'live-search',
    });
  }
  protected focus(): void { this.open.set(true); this.active.set(-1); }
  protected submit(event?: Event): void {
    event?.preventDefault();
    const q = this.query().trim();
    this.history.remember(q);
    this.open.set(false);
    this.router.navigate(['/catalog'], { queryParams: { q: q || null } });
  }
  protected pick(product: Product): void {
    this.history.remember(this.query());
    this.history.rememberProduct(product.id);
    this.open.set(false);
  }
  protected useHistory(query: string): void {
    const product = this.history.productFor(query);
    if (product) {
      this.history.rememberProduct(product.id);
      this.open.set(false);
      this.router.navigate(['/catalog', product.id]);
    } else { this.query.set(query); this.submit(); }
  }
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') { this.open.set(false); return; }
    const count = this.hasQuery() ? this.results().length : this.history.items().length;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.open.set(true);
      if (count) this.active.update(i => i < 0 ? (event.key === 'ArrowDown' ? 0 : count - 1) : (i + (event.key === 'ArrowDown' ? 1 : -1) + count) % count);
    } else if (event.key === 'Enter' && this.open() && this.active() >= 0 && this.active() < count) {
      event.preventDefault();
      if (this.hasQuery()) {
        const product = this.results()[this.active()];
        this.pick(product);
        this.router.navigate(['/catalog', product.id]);
      } else this.useHistory(this.history.items()[this.active()]);
    }
  }
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.open.set(false);
  }
  protected onFocusOut(event: FocusEvent): void {
    if (!this.host.nativeElement.contains(event.relatedTarget as Node | null)) this.open.set(false);
  }
}
