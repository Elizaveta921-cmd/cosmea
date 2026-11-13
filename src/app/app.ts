import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Breadcrumbs } from './layout/breadcrumbs';
import { Footer } from './layout/footer';
import { Header } from './layout/header';
import { NavigationService } from './core/services/navigation.service';
import { MobileNav } from './layout/mobile-nav';
import { ProductPreview } from './shared/ui/product-preview';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Breadcrumbs, Footer, MobileNav, ProductPreview],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly navigation = inject(NavigationService);
}