#!/usr/bin/env node
/**
 * Проверка собранного сайта (dist/) на битые внутренние ссылки и ресурсы.
 * Учитывает base path: все внутренние адреса обязаны начинаться с BASE_PATH (по умолчанию /phyton-crimea),
 * иначе после публикации в подкаталоге GitHub Pages они сломаются.
 * Запуск: node scripts/check-links.mjs  (после npm run build)
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const SITE = (process.env.SITE_URL || 'https://qwentytorantiny73.github.io').replace(/\/$/, '');
const rawBase = process.env.BASE_PATH ?? '/phyton-crimea';
const BASE = rawBase === '' || rawBase === '/' ? '' : `/${rawBase.replace(/^\/|\/$/g, '')}`;

if (!existsSync(DIST)) {
  console.error('Нет каталога dist/. Сначала выполните npm run build.');
  process.exit(1);
}

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const p = join(dir, name);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

const ATTR = /\s(?:href|src|srcset|content)\s*=\s*"([^"]*)"/g;
const errors = [];
let checked = 0;

function resolveInternal(pathname) {
  const clean = decodeURIComponent(pathname.split(/[?#]/)[0]);
  if (!clean.startsWith(`${BASE}/`) && clean !== BASE) return { error: 'адрес без base path' };
  const rel = clean.slice(BASE.length) || '/';
  const target = rel.endsWith('/') ? join(DIST, rel, 'index.html') : join(DIST, rel);
  return existsSync(target) ? {} : { error: `нет файла ${relative(DIST, target)}` };
}

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const page = '/' + relative(DIST, file);
  for (const m of html.matchAll(ATTR)) {
    const raw = m[1].replaceAll('&amp;', '&');
    const attr = m[0].trim().split('=')[0];
    const urls = attr === 'srcset' ? raw.split(',').map((s) => s.trim().split(/\s+/)[0]) : [raw];
    for (const u of urls) {
      if (!u || u.startsWith('#') || /^(mailto:|tel:|data:|javascript:)/.test(u)) continue;
      let pathname;
      if (/^https?:\/\//.test(u)) {
        if (!u.startsWith(SITE + '/')) continue; // внешние ссылки не проверяем
        pathname = u.slice(SITE.length);
      } else if (u.startsWith('/')) {
        pathname = u;
      } else if (attr === 'content') {
        continue; // meta content с обычным текстом
      } else {
        errors.push(`${page}: относительный адрес «${u}» — используйте url() из src/lib/url.ts`);
        continue;
      }
      checked += 1;
      const r = resolveInternal(pathname);
      if (r.error) errors.push(`${page}: ${u} — ${r.error}`);
    }
  }
}

const unique = [...new Set(errors)];
console.log(`Страниц: ${htmlFiles.length}, проверено внутренних ссылок и ресурсов: ${checked}, base path: «${BASE || '/'}»`);
if (unique.length) {
  console.error(`Найдено проблем: ${unique.length}`);
  for (const e of unique.slice(0, 50)) console.error(`  ${e}`);
  if (unique.length > 50) console.error(`  … и ещё ${unique.length - 50}`);
  process.exit(1);
}
console.log('Битых внутренних ссылок нет.');
