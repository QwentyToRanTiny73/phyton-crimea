// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * Адрес сайта и базовый путь задаются переменными окружения:
 * - SITE_URL — origin сайта, например https://qwentytorantiny73.github.io или https://yalta.example.ru;
 * - BASE_PATH — подкаталог (для GitHub Pages проекта это /<имя-репозитория>), для своего домена — «/».
 * В GitHub Actions оба значения подставляются автоматически из actions/configure-pages.
 */
const site = process.env.SITE_URL || 'https://qwentytorantiny73.github.io';
const rawBase = process.env.BASE_PATH ?? '/phyton-crimea';
const base = rawBase === '' ? '/' : rawBase;

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  output: 'static',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  image: {
    // Оптимизация через sharp на этапе сборки: webp, несколько ширин, lazy loading по умолчанию.
    breakpoints: [400, 640, 800, 1080, 1280, 1600, 1920, 2400],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
