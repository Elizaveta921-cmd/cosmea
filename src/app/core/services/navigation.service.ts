import { Injectable, inject } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** Отмечаем глубину именно внутри магазина, чтобы «Назад» не уводила на чужой сайт. */
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private depth = Number(history.state?.cosmeaDepth) || 0;

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (!(event instanceof NavigationEnd)) return;
      const navigation = this.router.currentNavigation();
      if (navigation?.trigger === 'popstate') {
        this.depth = Number(history.state?.cosmeaDepth) || 0;
      } else if (navigation?.previousNavigation && !navigation.extras.replaceUrl && !navigation.extras.skipLocationChange) {
        this.depth++;
      }
      history.replaceState({ ...history.state, cosmeaDepth: this.depth }, '');
    });
  }

  back(): void {
    if (this.depth > 0) this.location.back();
    else this.router.navigateByUrl(this.router.url.startsWith('/catalog/') ? '/catalog' : '/');
  }
}
