import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Params, Router } from '@angular/router';
import { CategoryId } from '../../core/models/product.model';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { Pagination } from '../../shared/ui/pagination';
import { ProductCard } from '../../shared/ui/product-card';
import { Icon } from '../../shared/ui/icon';

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'name';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: 'По популярности' },
  { key: 'price-asc', label: 'Сначала дешевле' },
  { key: 'price-desc', label: 'Сначала дороже' },
  { key: 'rating', label: 'По рейтингу' },
  { key: 'name', label: 'По названию' },
];

// Для каждого варианта сортировки: как сравнить два товара
const COMPARATORS: Record<SortKey, (a: Product, b: Product) => number> = {
  popular: (a, b) => b.reviews - a.reviews,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  name: (a, b) => a.name.localeCompare(b.name, 'ru'),
};

// Классы Tailwind должны быть записаны целиком, иначе он их не найдёт.
// Режим «6 в ряд» отличается от «4 в ряд» только на широких экранах (xl).
const GRID: Record<4 | 6, string> = {
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
};


@Component({
  selector: 'app-catalog-page',
  imports: [ProductCard, Pagination, PricePipe, Icon, NgTemplateOutlet],
  templateUrl: './catalog-page.html',
  host: { '(window:resize)': 'onResize()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPage {
  private readonly products = inject(ProductService);
  private readonly router = inject(Router);
  private readonly filtersDialog = viewChild.required<ElementRef<HTMLDialogElement>>('filtersDialog');

  readonly q = input<string>();
  readonly cat = input<string>();
  readonly routePage = input<string>(undefined, { alias: 'page' });
  readonly routeBrands = input<string>(undefined, { alias: 'brands' });
  readonly routeMax = input<string>(undefined, { alias: 'max' });
  readonly routeSale = input<string>(undefined, { alias: 'sale' });
  readonly routeSort = input<string>(undefined, { alias: 'sort' });
  readonly routeColumns = input<string>(undefined, { alias: 'cols' });

  protected readonly sorts = SORTS;
  protected readonly categories = this.products.categories;
  protected readonly brandList = this.products.brands;
  protected readonly sliderMax = Math.ceil(this.products.maxPrice / 100) * 100;
  protected readonly columnOptions: (4 | 6)[] = [4, 6];
  protected readonly pageSize = 12;

  protected readonly category = computed<CategoryId | null>(() => this.categories.find(c => c.id === this.cat())?.id ?? null);
  protected readonly brands = computed(() => (this.routeBrands() ?? '').split(',').filter(b => this.brandList.includes(b)));
  protected readonly priceMax = computed(() => {
    const value = this.routeMax() === undefined ? this.sliderMax : Number(this.routeMax());
    return Number.isFinite(value) ? Math.max(0, Math.min(this.sliderMax, value)) : this.sliderMax;
  });
  protected readonly onlySale = computed(() => this.routeSale() === '1');
  protected readonly sort = computed<SortKey>(() => this.sorts.find(s => s.key === this.routeSort())?.key ?? 'popular');
  protected readonly columns = computed<4 | 6>(() => this.routeColumns() === '6' ? 6 : 4);
  protected readonly page = computed(() => {
    const n = Number(this.routePage());
    return Number.isSafeInteger(n) && n > 0 ? n : 1;
  });
  protected readonly filtered = computed(() => this.products.search(this.q() ?? '')
    .filter(p => (!this.category() || p.category === this.category()) &&
      (!this.brands().length || this.brands().includes(p.brand)) && p.price <= this.priceMax() &&
      (!this.onlySale() || p.oldPrice !== undefined))
    .sort(COMPARATORS[this.sort()]));
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  protected readonly currentPage = computed(() => Math.min(this.page(), this.totalPages()));
  protected readonly pageItems = computed(() => this.filtered().slice((this.currentPage() - 1) * this.pageSize, this.currentPage() * this.pageSize));
  protected readonly gridClass = computed(() => GRID[this.columns()]);
  protected readonly filterCount = computed(() => Number(!!this.category()) + this.brands().length + Number(this.priceMax() < this.sliderMax) + Number(this.onlySale()));
  protected readonly hasFilters = computed(() => this.filterCount() > 0 || !!this.q());

  private update(params: Params, resetPage = true): void {
    this.router.navigate(['/catalog'], {
      queryParams: { ...params, ...(resetPage ? { page: null } : {}) },
      queryParamsHandling: 'merge', replaceUrl: true,
    });
  }
  protected setCategory(id: CategoryId | null): void { this.update({ cat: id }); }
  protected toggleBrand(brand: string): void {
    const list = this.brands().includes(brand) ? this.brands().filter(b => b !== brand) : [...this.brands(), brand];
    this.update({ brands: list.length ? list.join(',') : null });
  }
  protected onPrice(event: Event): void {
    const max = Number((event.target as HTMLInputElement).value);
    this.update({ max: max === this.sliderMax ? null : max });
  }
  protected onSort(event: Event): void { this.update({ sort: (event.target as HTMLSelectElement).value }); }
  protected toggleSale(): void { this.update({ sale: this.onlySale() ? null : '1' }); }
  protected setColumns(n: 4 | 6): void { this.update({ cols: n === 4 ? null : n }, false); }
  protected setPage(n: number): void { this.update({ page: n === 1 ? null : n }, false); }
  protected resetFilters(): void { this.router.navigate(['/catalog'], { queryParams: { cols: this.routeColumns() ?? null }, replaceUrl: true }); }
  protected openFilters(): void { this.filtersDialog().nativeElement.showModal(); }
  protected closeFilters(): void { this.filtersDialog().nativeElement.close(); }
  protected onBackdrop(event: MouseEvent): void { if (event.target === event.currentTarget) this.closeFilters(); }
  protected onResize(): void { if (window.innerWidth >= 1024) this.closeFilters(); }
}
