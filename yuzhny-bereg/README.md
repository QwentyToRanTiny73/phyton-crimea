# Южный берег — гид по Большой Ялте

Региональная информационная платформа Южного берега Крыма. Первый этап — Большая Ялта: от Фороса до Гурзуфа.

Это структурированный справочник, а не блог. В нём собраны места, организации, услуги, события и тематические подборки, связанные между собой. Сайт статический (SSG): каталог строится из локальных файлов, сервер и база данных не нужны.

> Проект лежит в подкаталоге `yuzhny-bereg/` репозитория `phyton-crimea`. В корне репозитория находится отдельный сайт «Фитон Крым» на Next.js, и с ним этот проект не пересекается. Как перенести проект в собственный репозиторий — в разделе [«Отдельный репозиторий»](#отдельный-репозиторий).

## Технологии

| Задача | Решение |
| --- | --- |
| Фреймворк | Astro 7, режим `output: 'static'` |
| Типизация | TypeScript (strictest), `astro check` |
| Стили | Tailwind CSS 4 (`@tailwindcss/vite`), дизайн-токены в `src/styles/global.css` |
| Данные | Astro Content Collections (Markdown + JSON) со схемами на Zod |
| Иконки | `@lucide/astro` — SVG на этапе сборки, без JS |
| Шрифты | Manrope и Lora (variable, self-hosted через Fontsource) |
| Изображения | `astro:assets` + sharp: webp, адаптивные `srcset`, lazy loading |
| Карты | Ссылки на OpenStreetMap и Яндекс Карты, встраиваемая карта OSM по клику, GeoJSON для будущего MapLibre GL JS |
| Публикация | GitHub Actions → GitHub Pages |

На клиенте работает около 3 КБ JavaScript: поиск и фильтры каталога, фильтры афиши, форма заявки, карта по клику и закрытие меню.

## Быстрый старт

Требуется Node.js 22.23.4 или новее (см. `.node-version`).

```bash
cd yuzhny-bereg
npm ci            # установка зависимостей
npm run dev       # http://localhost:4321/phyton-crimea/
```

Сайт открывается по адресу с base path (`/phyton-crimea/`), как на GitHub Pages. Чтобы запустить его в корне, укажите `BASE_PATH=/ npm run dev`.

| Команда | Что делает |
| --- | --- |
| `npm run dev` | Dev-сервер с горячей перезагрузкой |
| `npm run check` | Проверка типов и схем данных (`astro check`) |
| `npm run build` | Production-сборка в `dist/` |
| `npm run preview` | Локальный просмотр собранного `dist/` |
| `npm run verify` | `check` + `build` + проверка всех внутренних ссылок и ресурсов в `dist/` |

## Структура проекта

```
yuzhny-bereg/
├── astro.config.mjs          # site/base из переменных SITE_URL и BASE_PATH
├── scripts/check-links.mjs   # проверка битых ссылок в dist/ с учётом base path
├── public/                   # favicon
└── src/
    ├── content.config.ts     # схемы всех коллекций (единая модель данных)
    ├── content/
    │   ├── listings/         # места, организации, услуги (Markdown)
    │   ├── events/           # события афиши (Markdown)
    │   └── guides/           # подборки и маршруты (Markdown)
    ├── data/                 # справочники (JSON) и настройки сайта
    │   ├── categories.json   # категории каталога
    │   ├── settlements.json  # населённые пункты
    │   ├── regions.json      # регионы (сейчас — Большая Ялта)
    │   ├── service-types.json
    │   ├── event-categories.json
    │   ├── photos.json       # реестр фото: файл, alt, автор, лицензия, источник
    │   ├── icon-keys.ts      # иконки, доступные в данных
    │   └── site.ts           # название, описание, настройки формы
    ├── assets/photos/        # исходные фото (оптимизируются при сборке)
    ├── types/domain.ts       # доменные типы, не зависящие от источника данных
    ├── lib/                  # слой данных и утилиты
    │   ├── catalog.ts        # единственная точка чтения данных, проверка связей
    │   ├── url.ts            # ссылки с учётом base path
    │   ├── seo.ts            # JSON-LD (Schema.org)
    │   ├── format.ts, geo.ts, search.ts, icons.ts, tone.ts
    ├── scripts/              # клиентский TypeScript: каталог, афиша, форма
    ├── layouts/BaseLayout.astro
    ├── components/           # layout, ui, cards, catalog, events, entity, home
    ├── styles/global.css
    └── pages/                # маршруты сайта
```

### Страницы и адреса

| Адрес | Страница |
| --- | --- |
| `/` | Главная |
| `/katalog/` | Каталог: поиск, фильтры, сортировка. Состояние фильтров хранится в URL |
| `/kategorii/`, `/kategorii/<id>/` | Категории |
| `/geografiya/`, `/geografiya/<id>/` | Направления и страница населённого пункта |
| `/afisha/`, `/afisha/<id>/` | Афиша с фильтрами по дате и категории, страница события |
| `/obekty/<id>/` | Страница места, организации или услуги |
| `/podborki/`, `/podborki/<id>/` | Подборки и маршруты |
| `/predlozhit/` | Форма «Предложить объект» |
| `/o-proekte/`, `/istochniki/` | О проекте, источники данных и авторы фото |
| `/sitemap.xml`, `/robots.txt` | SEO |
| `/data/places.geojson` | Точки объектов и событий для будущей карты |

## Модель данных

Все сущности описаны в `src/content.config.ts`. Связи задаются по ID через `reference()`, поэтому каждый факт хранится в одном месте. Например, автор и лицензия фото записаны только в `photos.json`, а записи ссылаются на фото по ID.

- **Объект** (`listings`) — место (`place`), организация (`organization`) или услуга (`service`). Поля: ID и slug (имя файла), название, краткое и полное описание (тело Markdown), категория и дополнительные категории, типы услуг, населённый пункт, адрес, координаты с источником, фото, контакты, соцсети, ссылки, режим работы, стоимость, особенности, теги, статус публикации, даты создания и обновления.
- **Связи организаций.** Услуга указывает организацию в поле `provider`. Событие ссылается на организатора (`organizer`) и площадку (`venue`). У организации может быть несколько локаций (`locations`). Страница организации сама собирает её услуги и события — дублировать списки не нужно.
- **Событие** (`events`): название, описание, даты начала и окончания, время, площадка, адрес, категория события, организатор, стоимость, контакты, фото, координаты, ссылка на регистрацию.
- **Достоверность.** У каждой записи есть блок `verification`: статус (`sourced`, `owner`, `demo`, `unverified`), примечание и источники. Тестовые записи помечаются `demo: true`: в интерфейсе у них бейдж «Демо», страница закрыта `noindex`, запись не попадает в sitemap и не получает Schema.org.

Слой `src/lib/catalog.ts` разворачивает ссылки в готовые объекты и останавливает сборку с понятной ошибкой, если ссылка ведёт в никуда. Например: `[данные] Объект X: ссылка на несуществующую запись «Y»`.

## Как добавить объект

1. Создайте файл `src/content/listings/<id>.md`. Имя файла станет ID и адресом страницы (`/obekty/<id>/`), поэтому используйте латиницу через дефис.
2. Заполните frontmatter. Необязательные поля можно не писать.

```markdown
---
title: "Кофейня у моря"
kind: "organization"              # place | organization | service
legalForm: "sole-proprietor"      # необязательно: company | sole-proprietor | self-employed | nonprofit | state
category: "gde-poest"             # ID из src/data/categories.json
serviceTypes: ["coffee-shop"]     # ID из src/data/service-types.json
settlement: "yalta"               # ID из src/data/settlements.json
summary: "Короткое описание для карточки и meta description (20–240 символов)."
address: "ул. Примерная, 1"
coordinates: { lat: 44.4952, lng: 34.1699, source: "владелец объекта" }
photos: ["kofeynya-u-morya"]      # ID из src/data/photos.json
contacts: { phone: "+7 …", website: "https://…" }
socials: [{ network: "telegram", url: "https://t.me/…" }]
hours: "Ежедневно 8:00–20:00"
price: "Кофе от … ₽"
features: ["Веранда", "Завтраки"]
tags: ["кофе", "завтрак"]
related: ["naberezhnaya-yalty"]
verification: { status: "owner", note: "Данные подтверждены владельцем", checkedAt: "2026-12-01" }
featured: false
createdAt: 2026-12-01
updatedAt: 2026-12-01
---

Полное описание в Markdown: подзаголовки `##`, списки, ссылки.
```

3. Добавьте фото, если они есть. Положите файл в `src/assets/photos/` и запишите его в `src/data/photos.json`: `id`, `src`, `alt`, `author`, `license`, `licenseUrl`, `sourceUrl`, `sourceName`. Берите только снимки, на которые есть права. Если фото нет, карточка покажет оформленную обложку в цвете категории.
4. Запустите `npm run check`: схема проверит поля и ссылки.

**Услуга организации:** `kind: "service"` и `provider: "<id организации>"`.

**Событие:** файл в `src/content/events/`. Обязательны `eventCategory`, `settlement`, `startDate`, `summary`. Полезные поля: `endDate`, `startTime`, `endTime`, `venue` или `venueName`, `organizer` или `organizerName`, `price`, `registrationUrl`.

**Подборка:** файл в `src/content/guides/` с `cover` (ID фото) и упорядоченным списком `items` (ID объектов).

**Новый населённый пункт, регион, категория или тип услуги** добавляются строкой в соответствующий JSON в `src/data/`. Страницы, фильтры, меню и sitemap обновятся автоматически, компоненты править не нужно. Иконку категории выбирайте из `src/data/icon-keys.ts`. Новая иконка добавляется туда и в `src/lib/icons.ts`.

### Правила достоверности

- Не публикуйте телефоны, цены и расписания, пока их не подтвердил владелец или официальный источник.
- Для сведений из открытых источников ставьте `verification.status: "sourced"` и указывайте ссылки в `sources`.
- Тестовые записи помечайте `demo: true` и `verification.status: "demo"`. Сборка проверяет, что эти поля совпадают.

## Публикация на GitHub Pages

Workflow находится в `.github/workflows/deploy-yuzhny-bereg.yml` в корне репозитория. Он запускается при push в `main`, если менялись файлы в `yuzhny-bereg/`, а также вручную (Actions → Run workflow). Шаги: `npm ci` → `astro check` → `astro build` → проверка ссылок → публикация.

Первый запуск:

1. Влейте изменения в `main`.
2. В репозитории откройте **Settings → Pages → Build and deployment → Source** и выберите **GitHub Actions**.
3. Дождитесь зелёного запуска в **Actions**. Адрес сайта будет `https://<владелец>.github.io/phyton-crimea/`. GitHub переводит имя владельца в нижний регистр.

Base path и адрес сайта workflow получает из `actions/configure-pages` и передаёт в сборку через `SITE_URL` и `BASE_PATH`. Все внутренние ссылки строятся через `src/lib/url.ts`, а `scripts/check-links.mjs` останавливает деплой, если хоть одна ссылка или ресурс не учитывает base path.

### Собственный домен

1. В **Settings → Pages → Custom domain** укажите домен и настройте DNS по инструкции GitHub.
2. Ничего больше менять не нужно. При следующей сборке `configure-pages` вернёт новый адрес и пустой base path, и сайт соберётся для корня домена. Эту схему можно проверить локально: `SITE_URL=https://ваш-домен.ru BASE_PATH= npm run build`.
3. После переезда на свой домен начнёт работать `robots.txt`: поисковики читают его только в корне домена, а в подкаталоге GitHub Pages он игнорируется.

### Форма «Предложить объект»

Бэкенда нет, поэтому форма ничего не сохраняет. Она собирает текст заявки и:

- открывает письмо через `mailto:`, если задан адрес редакции;
- ведёт на внешнюю форму (Яндекс Формы, Google Forms), если она задана;
- в любом случае даёт скопировать текст заявки.

Адреса задаются переменными репозитория (**Settings → Secrets and variables → Actions → Variables**): `SUGGEST_EMAIL` и `SUGGEST_FORM_URL`. Локально используйте `PUBLIC_SUGGEST_EMAIL` и `PUBLIC_SUGGEST_FORM_URL`.

## Масштабирование

- **Новые районы ЮБК:** запись в `regions.json` и населённые пункты с этим `region`. Раздел «География» группирует направления по регионам.
- **Замена хранилища** (Supabase, PostgreSQL, CMS). Компоненты используют только типы из `src/types/domain.ts` и функции из `src/lib/catalog.ts`. Переписать нужно только `catalog.ts`. Другой вариант — оставить Content Collections и написать собственный loader, который забирает данные из API во время сборки.
- **Интерактивная карта:** `/data/places.geojson` уже отдаёт точки в формате GeoJSON, достаточно подключить MapLibre GL JS на отдельной странице.
- **Большой каталог.** При сотнях записей фильтрация на клиенте по готовому HTML остаётся быстрой. При тысячах её стоит заменить поисковым индексом (например, Pagefind) и пагинацией.

## Источники и фото

Сведения о реальных местах взяты из вступлений статей Википедии, координаты — из Википедии и Викиданных. Ссылки на источники есть на каждой странице объекта. Все фотографии — с Wikimedia Commons под свободными лицензиями (CC BY, CC BY-SA, CC0, общественное достояние). Авторы указаны под фото и на странице `/istochniki/`.

## Отдельный репозиторий

Чтобы вынести проект:

1. Скопируйте содержимое `yuzhny-bereg/` в корень нового репозитория.
2. Перенесите `.github/workflows/deploy-yuzhny-bereg.yml`.
3. В workflow удалите блок `defaults.run.working-directory` и префиксы `yuzhny-bereg/` в путях: `paths`, `node-version-file`, `cache-dependency-path`, `path`.

Base path подставится автоматически по имени нового репозитория.
