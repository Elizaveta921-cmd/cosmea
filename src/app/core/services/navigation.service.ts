import { Injectable, inject } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, Scroll } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface CatalogVisit { url: string; y: number; }
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private depth = Number(history.state?.cosmeaDepth) || 0;
  private from = '';
  private entryFrom: string | undefined;
  private restoreY: number | undefined;
  private catalog: CatalogVisit | null = this.restoreCatalog();

  private restoreCatalog(): CatalogVisit | null {
    try {
      const value = JSON.parse(sessionStorage.getItem('cosmea:catalog-return') ?? 'null');
      return value && value.url?.split('?')[0] === '/catalog' && Number.isFinite(value.y) && value.y >= 0 ? value : null;
    } catch { return null; }
  }

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.from = this.router.url;
        this.entryFrom = history.state?.cosmeaFrom;
        if (this.from.split('?')[0] === '/catalog') {
          this.catalog = { url: this.from, y: window.scrollY };
          try { sessionStorage.setItem('cosmea:catalog-return', JSON.stringify(this.catalog)); } catch { /* storage unavailable */ }
        }
      }
      if (event instanceof NavigationEnd) {
        const navigation = this.router.currentNavigation();
        if (navigation?.trigger === 'popstate') {
          this.depth = Number(history.state?.cosmeaDepth) || 0;
        } else {
          if (navigation?.previousNavigation && !navigation.extras.replaceUrl && !navigation.extras.skipLocationChange) this.depth++;
          const previous = !navigation?.previousNavigation || navigation.extras.replaceUrl ? this.entryFrom : this.from;
          history.replaceState({ ...history.state, cosmeaDepth: this.depth, cosmeaFrom: previous }, '');
        }
        this.restoreY = navigation?.extras.state?.['cosmeaRestoreY'];
      }
      if (event instanceof Scroll && Number.isFinite(this.restoreY)) {
        const y = this.restoreY!;
        this.restoreY = undefined;
        requestAnimationFrame(() => window.scrollTo(0, y));
      }
    });
  }

  back(): void {
    const previous = history.state?.cosmeaFrom;
    const product = this.router.url.split('?')[0].startsWith('/catalog/');
    // The actual preceding route is more reliable than an inferred navigation count.
    if (product && typeof previous === 'string' && previous.startsWith('/') && !previous.startsWith('//')) {
      this.location.back();
    } else if (product && this.catalog) {
      this.router.navigateByUrl(this.catalog.url, { state: { cosmeaRestoreY: this.catalog.y } });
    } else if (product) {
      this.router.navigateByUrl('/catalog');
    } else if (this.depth > 0) this.location.back();
    else this.router.navigateByUrl('/');
  }
}
