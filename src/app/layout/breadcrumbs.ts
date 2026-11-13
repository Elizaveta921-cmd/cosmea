import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { BackButton } from './back-button';

interface Crumb { label: string; url: string; }

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink, BackButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (crumbs().length > 1) {
      <div class="border-b border-sand bg-white/60" [class.max-md:hidden]="crumbs().length === 2 && crumbs()[1].url === '/catalog'">
        <div class="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 text-sm">
          <app-back-button />
          <nav aria-label="Хлебные крошки">
            <ol class="flex flex-wrap items-center gap-2 text-ink/60">
              @for (c of crumbs(); track c.url; let last = $last) {
                <li class="flex items-center gap-2">
                  @if (last) {
                    <span aria-current="page" class="text-ink">{{ c.label }}</span>
                  } @else {
                    <a [routerLink]="c.url" class="hover:text-rosewood">{{ c.label }}</a>
                    <span aria-hidden="true">/</span>
                  }
                </li>
              }
            </ol>
          </nav>
        </div>
      </div>
    }
  `,
})
export class Breadcrumbs {
  private readonly router = inject(Router);

  // toSignal превращает поток событий роутера (RxJS) в signal — отписка происходит автоматически
  protected readonly crumbs = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.build()),
    ),
    { initialValue: [] as Crumb[] },
  );

  private build(): Crumb[] {
    const crumbs: Crumb[] = [{ label: 'Главная', url: '/' }];
    let route = this.router.routerState.snapshot.root;
    let url = '';

    while (route.firstChild) {
      route = route.firstChild;
      const segment = route.url.map(s => s.path).join('/');
      if (segment) url += '/' + segment;

      // crumbTitle — динамическое название (например, имя товара), breadcrumb — статическое
      const label: string | undefined = route.data['crumbTitle'] ?? route.data['breadcrumb'];
      if (label && !crumbs.some(c => c.url === url)) crumbs.push({ label, url });
    }
    return crumbs;
  }
}