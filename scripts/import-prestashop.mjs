#!/usr/bin/env node
/**
 * =============================================================================
 * Скрипт миграции товаров из PrestaShop → lib/data/products.ts
 * =============================================================================
 *
 * ИСПОЛЬЗОВАНИЕ:
 *   1. Экспортируйте товары из PrestaShop (см. ниже как это сделать)
 *   2. Положите CSV файл рядом со скриптом: scripts/prestashop_products.csv
 *   3. Запустите: node scripts/import-prestashop.mjs
 *   4. Проверьте созданные файлы:
 *        lib/data/products.generated.ts
 *        lib/data/categories.generated.ts
 *   5. Если всё корректно — переименуйте их в products.ts и categories.ts
 *
 * =============================================================================
 * КАК ЭКСПОРТИРОВАТЬ ИЗ PRESTASHOP:
 * =============================================================================
 *
 * Способ 1 — Стандартный экспорт (рекомендуется):
 *   Каталог → Товары → кнопка «Экспорт» (вверху справа) → CSV
 *   Файл будет называться products_YYYY-MM-DD.csv
 *
 * Способ 2 — Через модуль «Экспорт/Импорт»:
 *   Модули → Поиск «Export» → Module de export de la boutique
 *   или используйте модуль Prestashop CSV Export Products
 *
 * Способ 3 — SQL запрос (если есть доступ к phpMyAdmin):
 *   Скопируйте запрос из комментария в конце этого файла.
 *
 * =============================================================================
 * ОЖИДАЕМЫЕ КОЛОНКИ CSV:
 * =============================================================================
 * Скрипт автоматически определяет формат. Поддерживаются:
 *
 * Стандартный PrestaShop экспорт:
 *   ID, Name *(ru), Summary (ru), Description (ru), Reference,
 *   Price tax excl., Old price tax excl., Categories (x,y,z...),
 *   Image URLs (x,y,z...), Quantity, Active (0/1)
 *
 * Упрощённый формат (если делаете экспорт вручную):
 *   id, name, description, short_description, price, old_price,
 *   category, image_url, sku, in_stock, volume, weight
 * =============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Транслитерация русского → латинский для slug ──────────────────────────────
const TRANSLIT_MAP = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z',
  'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r',
  'с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh',
  'щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
  'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh','З':'Z',
  'И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R',
  'С':'S','Т':'T','У':'U','Ф':'F','Х':'Kh','Ц':'Ts','Ч':'Ch','Ш':'Sh',
  'Щ':'Shch','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya',
};

function toSlug(name) {
  return name
    .split('')
    .map(ch => TRANSLIT_MAP[ch] ?? ch)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

// ── Маппинг категорий PrestaShop → наши slug'и ───────────────────────────────
// Дополните этот список вашими категориями из PrestaShop
const CATEGORY_MAP = {
  // Уход за лицом
  'уход за лицом': 'face', 'для лица': 'face', 'лицо': 'face',
  'кремы для лица': 'face', 'маски для лица': 'face', 'сыворотки': 'face',
  'тоники': 'face', 'face': 'face', 'face care': 'face',

  // Уход за телом
  'уход за телом': 'body', 'для тела': 'body', 'тело': 'body',
  'кремы для тела': 'body', 'масла для тела': 'body', 'скрабы': 'body',
  'body': 'body', 'body care': 'body',

  // Волосы
  'уход за волосами': 'hair', 'для волос': 'hair', 'волосы': 'hair',
  'шампуни': 'hair', 'маски для волос': 'hair', 'бальзамы': 'hair',
  'hair': 'hair', 'hair care': 'hair',

  // Мыло
  'мыло': 'soap', 'натуральное мыло': 'soap', 'мыло ручной работы': 'soap',
  'soap': 'soap', 'handmade soap': 'soap',

  // Эфирные масла
  'эфирные масла': 'oils', 'масла': 'oils', 'ароматические масла': 'oils',
  'oils': 'oils', 'essential oils': 'oils',

  // Наборы
  'наборы': 'sets', 'подарочные наборы': 'sets', 'наборы подарочные': 'sets',
  'подарки': 'sets', 'sets': 'sets', 'gift sets': 'sets',
};

function mapCategory(rawCategory) {
  if (!rawCategory) return 'face';
  // Разбиваем составные категории "Главная, Уход за лицом, Кремы"
  const parts = rawCategory.split(',').map(s => s.trim().toLowerCase());
  for (const part of parts) {
    if (CATEGORY_MAP[part]) return CATEGORY_MAP[part];
    // Частичное совпадение
    for (const [key, value] of Object.entries(CATEGORY_MAP)) {
      if (part.includes(key) || key.includes(part)) return value;
    }
  }
  console.warn(`  ⚠ Неизвестная категория: "${rawCategory}" → назначена "face"`);
  return 'face';
}

// ── Парсинг CSV ───────────────────────────────────────────────────────────────
function parseCSV(content) {
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (lines.length < 2) throw new Error('CSV файл пустой или содержит только заголовок');

  const separator = lines[0].includes(';') ? ';' : ',';

  function parseLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (line[i] === separator && !inQuotes) {
        result.push(current.trim()); current = '';
      } else {
        current += line[i];
      }
    }
    result.push(current.trim());
    return result;
  }

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => { row[h] = (values[idx] ?? '').trim(); });
    rows.push(row);
  }
  return { headers, rows };
}

// ── Нормализация строки из CSV в поля продукта ────────────────────────────────
function normalizeRow(row) {
  // Находим нужные поля независимо от языка/формата колонок
  const get = (...keys) => {
    for (const k of keys) {
      for (const [rk, rv] of Object.entries(row)) {
        if (rk === k || rk.startsWith(k)) return rv || '';
      }
    }
    return '';
  };

  const name        = get('name *(ru)', 'name * (ru)', 'name *(russian)', 'name', 'название', 'наименование');
  const shortDesc   = get('summary (ru)', 'summary', 'short_description', 'краткое описание', 'short description');
  const description = get('description (ru)', 'description', 'описание');
  const sku         = get('reference', 'sku', 'артикул', 'ref');
  const priceRaw    = get('price tax excl.', 'price', 'цена', 'price (tax excl.)');
  const oldPriceRaw = get('old price tax excl.', 'old price', 'старая цена', 'old_price');
  const category    = get('categories (x,y,z...)', 'categories', 'category', 'категория', 'cat');
  const imagesRaw   = get('image urls (x,y,z...)', 'image urls', 'image_url', 'imageurl', 'изображения', 'images');
  const qtyRaw      = get('quantity', 'qty', 'количество', 'stock');
  const activeRaw   = get('active (0/1)', 'active', 'активен', 'enabled');
  const volume      = get('volume', 'объём', 'объем', 'вес', 'weight', 'meta_description');

  if (!name) return null; // пропускаем пустые строки

  const price    = parseFloat(priceRaw.replace(',', '.')) || 0;
  const oldPrice = parseFloat(oldPriceRaw.replace(',', '.')) || 0;
  const inStock  = qtyRaw ? parseInt(qtyRaw) > 0 : (activeRaw !== '0');

  const images = imagesRaw
    .split(',')
    .map(u => u.trim())
    .filter(u => u.startsWith('http'));

  return {
    name,
    shortDescription: shortDesc || name,
    description: description || shortDesc || name,
    sku: sku || `FC-${Math.floor(Math.random() * 9000 + 1000)}`,
    price,
    oldPrice: oldPrice > price ? oldPrice : undefined,
    categorySlug: mapCategory(category),
    imageUrl: images[0] || '',
    images: images.slice(1),
    inStock,
    volume: volume || undefined,
  };
}

// ── Генерация TypeScript файлов ───────────────────────────────────────────────
function generateProductsTS(products) {
  const lines = [
    `import type { Product } from '@/types';`,
    ``,
    `// Сгенерировано import-prestashop.mjs ${new Date().toISOString().slice(0, 10)}`,
    `// Проверьте данные и переименуйте в products.ts`,
    `export const products: Product[] = [`,
  ];

  products.forEach((p, i) => {
    lines.push(`  {`);
    lines.push(`    id: 'p${i + 1}',`);
    lines.push(`    slug: '${p.slug}',`);
    lines.push(`    name: ${JSON.stringify(p.name)},`);
    lines.push(`    shortDescription: ${JSON.stringify(p.shortDescription)},`);
    lines.push(`    description: ${JSON.stringify(p.description)},`);
    if (p.ingredients)  lines.push(`    ingredients: ${JSON.stringify(p.ingredients)},`);
    lines.push(`    price: ${p.price},`);
    if (p.oldPrice)     lines.push(`    oldPrice: ${p.oldPrice},`);
    lines.push(`    imageUrl: ${JSON.stringify(p.imageUrl)},`);
    if (p.images?.length) lines.push(`    images: ${JSON.stringify(p.images)},`);
    lines.push(`    categorySlug: '${p.categorySlug}',`);
    lines.push(`    inStock: ${p.inStock},`);
    if (p.volume)       lines.push(`    volume: ${JSON.stringify(p.volume)},`);
    if (p.weight)       lines.push(`    weight: ${JSON.stringify(p.weight)},`);
    lines.push(`    sku: ${JSON.stringify(p.sku)},`);
    lines.push(`  },`);
  });

  lines.push(`];`);
  lines.push(``);

  // Вспомогательные функции
  lines.push(`export function getProductBySlug(slug: string): Product | undefined {`);
  lines.push(`  return products.find((p) => p.slug === slug);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export function getProductsByCategory(categorySlug: string): Product[] {`);
  lines.push(`  return products.filter((p) => p.categorySlug === categorySlug);`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export function getBestsellers(): Product[] {`);
  lines.push(`  return products.filter((p) => p.isBestseller).slice(0, 8);`);
  lines.push(`}`);
  lines.push(``);

  return lines.join('\n');
}

// ── Основная логика ───────────────────────────────────────────────────────────
async function main() {
  const csvPath = process.argv[2]
    || path.join(__dirname, 'prestashop_products.csv');

  console.log('\n🌿 Фитон Крым — миграция товаров из PrestaShop\n');

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV файл не найден: ${csvPath}`);
    console.error(`\nКак экспортировать из PrestaShop:`);
    console.error(`  Каталог → Товары → кнопка «Экспорт» (вверху справа) → CSV\n`);
    console.error(`Затем запустите:`);
    console.error(`  node scripts/import-prestashop.mjs путь/к/файлу.csv\n`);
    process.exit(1);
  }

  console.log(`📂 Читаю: ${csvPath}`);
  const content = fs.readFileSync(csvPath, 'utf-8');
  const { rows } = parseCSV(content);
  console.log(`   Найдено строк: ${rows.length}`);

  // Нормализуем товары
  const usedSlugs = new Set();
  const products = [];

  for (const row of rows) {
    const p = normalizeRow(row);
    if (!p) continue;
    if (!p.name) continue;
    if (p.price <= 0) {
      console.warn(`  ⚠ Пропущен товар "${p.name}" — цена 0`);
      continue;
    }

    // Уникальный slug
    let slug = toSlug(p.name);
    if (!slug) slug = `product-${products.length + 1}`;
    let uniqueSlug = slug;
    let counter = 2;
    while (usedSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter++}`;
    }
    usedSlugs.add(uniqueSlug);
    p.slug = uniqueSlug;

    products.push(p);
  }

  console.log(`\n✅ Обработано товаров: ${products.length}`);

  // Статистика по категориям
  const catCount = {};
  products.forEach(p => { catCount[p.categorySlug] = (catCount[p.categorySlug] || 0) + 1; });
  console.log('\n📊 По категориям:');
  Object.entries(catCount).forEach(([cat, cnt]) => {
    console.log(`   ${cat.padEnd(8)} → ${cnt} товаров`);
  });

  // Предупреждение о товарах без изображений
  const noImg = products.filter(p => !p.imageUrl);
  if (noImg.length) {
    console.log(`\n⚠  Товары без изображений (${noImg.length}):`);
    noImg.forEach(p => console.log(`   - ${p.name} (${p.sku})`));
    console.log(`   Для них нужно вручную подобрать фото на unsplash.com`);
  }

  // Записываем результат
  const outPath = path.join(ROOT, 'lib/data/products.generated.ts');
  fs.writeFileSync(outPath, generateProductsTS(products), 'utf-8');

  console.log(`\n📝 Файл записан: lib/data/products.generated.ts`);
  console.log(`\nДальнейшие шаги:`);
  console.log(`  1. Проверьте lib/data/products.generated.ts`);
  console.log(`  2. Убедитесь что slug'и корректны`);
  console.log(`  3. Добавьте imageUrl для товаров без фото (unsplash.com)`);
  console.log(`  4. Замените файл: mv lib/data/products.generated.ts lib/data/products.ts`);
  console.log(`  5. Запустите: npm run build — убедитесь что сборка прошла\n`);
}

main().catch(err => {
  console.error('❌ Ошибка:', err.message);
  process.exit(1);
});

/*
=============================================================================
SQL ЗАПРОС ДЛЯ ЭКСПОРТА ИЗ PHPМYADMIN (если нет доступа к PrestaShop-панели)
=============================================================================

SELECT
  p.id_product AS 'ID',
  pl.name AS 'Name *(ru)',
  pl.description_short AS 'Summary (ru)',
  pl.description AS 'Description (ru)',
  p.reference AS 'Reference',
  p.price AS 'Price tax excl.',
  p.wholesale_price AS 'Old price tax excl.',
  GROUP_CONCAT(DISTINCT cl.name ORDER BY c.level_depth DESC SEPARATOR ', ') AS 'Categories (x,y,z...)',
  GROUP_CONCAT(DISTINCT CONCAT('https://ВАШ-ДОМЕН/img/p/', i.id_image, '-', i.id_image, '.jpg') SEPARATOR ', ') AS 'Image URLs (x,y,z...)',
  sa.quantity AS 'Quantity',
  p.active AS 'Active (0/1)'
FROM ps_product p
  LEFT JOIN ps_product_lang pl ON p.id_product = pl.id_product AND pl.id_lang = 1
  LEFT JOIN ps_category_product cp ON p.id_product = cp.id_product
  LEFT JOIN ps_category_lang cl ON cp.id_category = cl.id_category AND cl.id_lang = 1
  LEFT JOIN ps_category c ON cp.id_category = c.id_category
  LEFT JOIN ps_image i ON p.id_product = i.id_product AND i.cover = 1
  LEFT JOIN ps_stock_available sa ON p.id_product = sa.id_product AND sa.id_product_attribute = 0
WHERE p.active = 1
GROUP BY p.id_product
ORDER BY p.id_product;

Сохраните результат через: Экспорт → CSV → Выполнить

ВАЖНО: Замените "ps_" на реальный префикс ваших таблиц (проверьте в phpMyAdmin).
Замените "ВАШ-ДОМЕН" на домен вашего PrestaShop.
=============================================================================
*/
