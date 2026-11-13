import { test as base, expect } from '@playwright/test';

const test = base.extend<{ runtimeCheck: void }>({
  runtimeCheck: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await use();
    expect(errors, 'No unhandled application errors').toEqual([]);
  }, { auto: true }],
});

test('cart quantities stay synchronized between catalog, product, cart and reload', async ({ page }) => {
  await page.goto('/catalog', { waitUntil: 'domcontentloaded' });
  const card = page.locator('app-catalog-page app-product-card').first();
  const id = await card.locator('article').getAttribute('data-product-id');
  await card.getByRole('button', { name: /^Добавить в корзину:/ }).click();
  await card.getByRole('button', { name: /^Увеличить количество:/ }).click();
  await expect(card.locator('app-cart-control')).toContainText('2 шт.');
  await card.locator('a').first().click();
  await expect(page).toHaveURL(new RegExp('/catalog/' + id + '$'));
  const detail = page.locator('app-product-page > section > div').first();
  await expect(detail.locator('app-cart-control')).toContainText('2 шт.');
  await detail.getByRole('button', { name: /^Увеличить количество:/ }).click();
  await page.reload();
  await expect(page.locator('app-product-page app-cart-control').first()).toContainText('3 шт.');
  await page.goto('/cart');
  const controls = page.locator('app-cart-page app-cart-control');
  await expect(controls).toContainText('3 шт.');
  for (let i = 0; i < 3; i++) await controls.getByRole('button', { name: /^Уменьшить количество:/ }).click();
  await expect(page.getByText('Корзина пуста', { exact: true })).toBeVisible();
});

test('search starts with one character and history survives reload, reuses and deletes queries', async ({ page }) => {
  await page.goto('/catalog', { waitUntil: 'domcontentloaded' });
  const search = page.getByRole('combobox', { name: 'Поиск по каталогу' });
  await search.focus();
  await expect(page.getByText('История поиска', { exact: true })).toBeVisible();
  await search.fill('к');
  await expect(page.locator('#search-suggestions a')).toHaveCount(5);
  await search.press('ArrowUp');
  await expect(search).toHaveAttribute('aria-activedescendant', 'search-option-4');
  await search.press('Escape');
  await search.fill('крем');
  await search.press('Enter');
  await expect(page).toHaveURL(/q=/);
  await page.reload();
  await search.fill('');
  await search.focus();
  await expect(page.getByRole('option', { name: 'крем', exact: true })).toBeVisible();
  await page.getByRole('option', { name: 'крем', exact: true }).click();
  await expect(search).toHaveValue('крем');
  await search.fill('');
  await page.getByRole('button', { name: 'Удалить запрос: крем', exact: true }).click();
  await expect(page.getByRole('option', { name: 'крем', exact: true })).toHaveCount(0);
  await search.fill('маска'); await search.press('Enter');
  await expect(page).toHaveURL(/q=/);
  await search.fill(''); await search.focus();
  await page.getByRole('button', { name: 'Очистить', exact: true }).click();
  await search.focus();
  await expect(page.getByText('Здесь появятся ваши поисковые запросы.')).toBeVisible();
});

test('Back restores page three and the exact catalog scroll position', async ({ page }) => {
  await page.goto('/catalog', { waitUntil: 'domcontentloaded' });
  await page.getByRole('navigation', { name: 'Страницы каталога' }).getByRole('button', { name: '3', exact: true }).click();
  await expect(page).toHaveURL(/page=3/);
  const card = page.locator('app-catalog-page app-product-card').first();
  await card.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 220));
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  const before = await page.evaluate(() => scrollY);
  await card.locator('a').nth(1).click();
  await page.getByRole('button', { name: 'Назад', exact: true }).click();
  await expect(page).toHaveURL(/page=3/);
  await expect(page.locator('app-catalog-page app-product-card')).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(before, 0);
});

test('direct product entry uses an internal Back fallback', async ({ page }) => {
  await page.goto('/catalog/1');
  await page.getByRole('button', { name: 'Назад', exact: true }).click();
  await expect(page).toHaveURL(new RegExp("/catalog$"));
});

test('cart handles saved invalid entries and enforces the quantity limit', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.setItem('cosmea:cart', JSON.stringify([{ productId: 1, qty: 1000 }, { productId: 999, qty: 5 }, { productId: 2, qty: -1 }])));
  await page.goto('/catalog/1');
  const control = page.locator('app-product-page app-cart-control').first();
  await expect(control).toContainText('99 шт.');
  await expect(control.getByRole('button', { name: /^Увеличить количество:/ })).toBeDisabled();
  await page.goto('/cart');
  await expect(page.locator('app-cart-page li')).toHaveCount(1);
});

test('hero wraps across the clone without rewinding the slide track', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const hero = page.locator('app-hero-carousel');
  await expect(hero.getByRole('button', { name: /Предыдущий слайд|Следующий слайд/ })).toHaveCount(0);
  await hero.getByRole('button', { name: 'Слайд 3', exact: true }).click();
  const track = hero.locator('section > div').first();
  await expect.poll(() => track.evaluate(el => (el as HTMLElement).style.transform)).toBe('translateX(-300%)');
  // An input during the previous animation must be queued rather than ignored.
  await hero.getByRole('button', { name: 'Слайд 1', exact: true }).click();
  await expect.poll(() => track.evaluate(el => (el as HTMLElement).style.transform)).toBe('translateX(-400%)');
  await expect.poll(() => track.evaluate(el => (el as HTMLElement).style.transform)).toBe('translateX(-100%)');
});

test('desktop preview edits the cart in place and returns keyboard focus on Escape', async ({ page, isMobile }) => {
  test.skip(isMobile);
  await page.goto('/catalog', { waitUntil: 'domcontentloaded' });
  const card = page.locator('app-catalog-page app-product-card').first();
  await card.hover();
  const trigger = card.getByRole('button', { name: /^Предпросмотр:/ });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: /^Добавить в корзину:/ }).click();
  await dialog.getByRole('button', { name: /^Увеличить количество:/ }).click();
  await expect(dialog.locator('app-cart-control')).toContainText('2 шт.');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(card.locator('app-cart-control')).toContainText('2 шт.');
  await expect(page).toHaveURL(new RegExp("/catalog$"));
});

test('desktop grid icons switch columns and keep filters after product navigation', async ({ page, isMobile }) => {
  test.skip(isMobile);
  await page.goto('/catalog', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('На странице:', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: '6 товара в ряд', exact: true }).click();
  await expect(page).toHaveURL(/cols=6/);
  await expect(page.getByRole('button', { name: '6 товара в ряд', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('combobox', { name: 'Сортировка', exact: true }).selectOption('price-asc');
  await expect(page).toHaveURL(/sort=price-asc/);
  const first = page.locator('app-catalog-page app-product-card').first();
  const id = await first.locator('article').getAttribute('data-product-id');
  await first.locator('a').nth(1).click();
  await page.getByRole('button', { name: 'Назад', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Сортировка', exact: true })).toHaveValue('price-asc');
  await expect(page.locator('app-catalog-page app-product-card').first().locator('article')).toHaveAttribute('data-product-id', id!);
  await expect(page.getByRole('button', { name: '6 товара в ряд', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('bestsellers align complete cards at both ends without page overflow', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const strip = page.locator('.bestseller-strip');
  await strip.scrollIntoViewIfNeeded();
  const geometry = await strip.evaluate(el => {
    const first = el.firstElementChild!.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(el).columnGap);
    const visible = innerWidth < 768 ? 2 : 4;
    return { filled: first.width * visible + gap * (visible - 1), viewport: el.clientWidth };
  });
  expect(Math.abs(geometry.filled - geometry.viewport)).toBeLessThan(2);
  await strip.evaluate(el => { el.scrollLeft = el.scrollWidth; });
  const right = await strip.evaluate(el => ({ card: el.lastElementChild!.getBoundingClientRect().right, strip: el.getBoundingClientRect().right }));
  expect(Math.abs(right.card - right.strip)).toBeLessThan(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test('mobile bottom navigation and one-line catalog toolbar work with the filter sheet', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/catalog', { waitUntil: 'domcontentloaded' });
  const nav = page.getByRole('navigation', { name: 'Мобильное меню' });
  await expect(nav).toBeVisible();
  const sort = await page.getByRole('combobox', { name: 'Сортировка', exact: true }).boundingBox();
  const filter = await page.getByRole('button', { name: 'Фильтры', exact: true }).boundingBox();
  expect(sort!.x).toBeLessThan(filter!.x);
  expect(Math.abs(sort!.y - filter!.y)).toBeLessThan(5);
  await page.getByRole('button', { name: 'Фильтры', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Уход за лицом', exact: true }).click();
  await dialog.getByRole('checkbox', { name: 'Только со скидкой' }).check();
  await dialog.getByRole('button', { name: /Показать товары/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/cat=face/);
  await expect(page).toHaveURL(/sale=1/);
  await expect(page.locator('app-catalog-page app-product-card')).toHaveCount(2);
  await expect(page.locator('app-catalog-page .quick-view-trigger').first()).not.toBeVisible();
  await nav.getByRole('link', { name: 'Избранное' }).click();
  await expect(page).toHaveURL(/favorites$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test('mobile bestsellers autoplay and pause when touched', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const strip = page.locator('.bestseller-strip');
  await strip.scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Вперёд', exact: true })).not.toBeVisible();
  await expect.poll(() => strip.evaluate(el => el.scrollLeft), { timeout: 6500 }).toBeGreaterThan(20);
  await strip.dispatchEvent('pointerdown');
  await page.waitForTimeout(800);
  const paused = await strip.evaluate(el => el.scrollLeft);
  await page.waitForTimeout(3800);
  expect(await strip.evaluate(el => el.scrollLeft)).toBeCloseTo(paused, 0);
});

test('search history completes catalog terms and rejects meaningless or ambiguous fragments', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('history-seeded')) {
      localStorage.setItem('cosmea:search-history', JSON.stringify(['сы', 'сыв', 'сыворотка', '@@@', 'для', 'неттакоготовара123']));
      sessionStorage.setItem('history-seeded', '1');
    }
  });
  await page.goto('/catalog', { waitUntil: 'domcontentloaded' });
  const search = page.getByRole('combobox', { name: 'Поиск по каталогу' });
  const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('cosmea:search-history') ?? '[]'));
  await search.focus();
  await expect(page.getByRole('option', { name: 'сыворотка', exact: true })).toBeVisible();
  await expect.poll(saved).toEqual(['сыворотка']);
  for (const query of ['сы', 'сыв', 'шам', 'кр']) {
    await search.fill(query);
    await search.press('Enter');
    await page.waitForURL(url => url.searchParams.get('q') === query);
  }
  await expect.poll(saved).toEqual(['крем', 'шампунь', 'сыворотка']);
  for (const query of ['к', '@@@', 'для', 'ту', 'неттакоготовара123']) {
    await search.fill(query);
    await search.press('Enter');
    await page.waitForURL(url => url.searchParams.get('q') === query);
  }
  await expect.poll(saved).toEqual(['крем', 'шампунь', 'сыворотка']);
  await search.fill('сы');
  await page.locator('#search-suggestions a').first().click();
  await expect(page).toHaveURL(new RegExp('/catalog/1$'));
  await expect.poll(saved).toEqual(['сыворотка', 'крем', 'шампунь']);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await search.focus();
  await expect(page.getByRole('option', { name: 'сыворотка', exact: true })).toBeVisible();
  await expect.poll(saved).toEqual(['сыворотка', 'крем', 'шампунь']);
});
