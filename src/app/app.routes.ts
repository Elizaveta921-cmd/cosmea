import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { ProductService } from './core/services/product.service';

// Заголовок вкладки браузера для товара
const productTitle: ResolveFn<string> = route => {
  const p = inject(ProductService).getById(Number(route.paramMap.get('id')));
  return p ? `${p.name} — Cosmea` : 'Товар не найден — Cosmea';
};

// Название товара для хлебных крошек (его читает компонент Breadcrumbs)
const productCrumb: ResolveFn<string> = route =>
  inject(ProductService).getById(Number(route.paramMap.get('id')))?.name ?? 'Товар не найден';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Cosmea — магазин косметики',
    loadComponent: () => import('./pages/home/home-page').then(m => m.HomePage),
  },
  {
    path: 'catalog',
    data: { breadcrumb: 'Каталог' },
    children: [
      {
        path: '',
        title: 'Каталог — Cosmea',
        loadComponent: () => import('./pages/catalog/catalog-page').then(m => m.CatalogPage),
      },
      {
        path: ':id',
        title: productTitle,
        resolve: { crumbTitle: productCrumb },
        loadComponent: () => import('./pages/product/product-page').then(m => m.ProductPage),
      },
    ],
  },
  {
    path: 'favorites',
    title: 'Избранное — Cosmea',
    data: { breadcrumb: 'Избранное' },
    loadComponent: () => import('./pages/favorites/favorites-page').then(m => m.FavoritesPage),
  },
  {
    path: 'cart',
    title: 'Корзина — Cosmea',
    data: { breadcrumb: 'Корзина' },
    loadComponent: () => import('./pages/cart/cart-page').then(m => m.CartPage),
  },
  { path: '**', redirectTo: '' },
];