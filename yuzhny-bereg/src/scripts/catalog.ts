/**
 * Клиентский поиск, фильтрация и сортировка каталога.
 * Все карточки уже есть в HTML (SSG); скрипт только скрывает и переупорядочивает элементы
 * по data-атрибутам и синхронизирует состояние с адресной строкой (?q=&category=&settlement=&type=&kind=&sort=).
 */
import { matches, tokens } from '@/lib/search';
import { countLabel } from '@/lib/format';

const FILTERS = ['category', 'settlement', 'type', 'kind'] as const;
type Filter = (typeof FILTERS)[number];
type Sort = 'rank' | 'title' | 'new' | 'updated';

interface Item {
  el: HTMLElement;
  search: string;
  values: Record<Filter, string[]>;
  title: string;
  rank: number;
  created: string;
  updated: string;
}

const collator = new Intl.Collator('ru');

export function initCatalog(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-catalog-form]');
  const list = root.querySelector<HTMLElement>('[data-results]');
  const count = root.querySelector<HTMLElement>('[data-count]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  if (!form || !list || !count || !empty) return;

  const items: Item[] = Array.from(list.querySelectorAll<HTMLElement>('[data-item]')).map((el) => ({
    el,
    search: el.dataset.search ?? '',
    values: {
      category: (el.dataset.category ?? '').split(' '),
      settlement: (el.dataset.settlement ?? '').split(' '),
      type: (el.dataset.type ?? '').split(' '),
      kind: [el.dataset.kind ?? ''],
    },
    title: el.dataset.title ?? '',
    rank: Number(el.dataset.rank ?? 0),
    created: el.dataset.created ?? '',
    updated: el.dataset.updated ?? '',
  }));

  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;

  // Начальное состояние из URL.
  const params = new URLSearchParams(window.location.search);
  for (const name of ['q', ...FILTERS, 'sort']) {
    const el = field(name);
    const value = params.get(name);
    if (el && value !== null) {
      if (el instanceof HTMLSelectElement && !Array.from(el.options).some((o) => o.value === value)) continue;
      el.value = value;
    }
  }

  const comparators: Record<Sort, (a: Item, b: Item) => number> = {
    rank: (a, b) => a.rank - b.rank,
    title: (a, b) => collator.compare(a.title, b.title),
    new: (a, b) => b.created.localeCompare(a.created) || a.rank - b.rank,
    updated: (a, b) => b.updated.localeCompare(a.updated) || a.rank - b.rank,
  };

  let lastOrder = '';

  function apply(): void {
    const q = tokens(field('q')?.value ?? '');
    const active = Object.fromEntries(FILTERS.map((f) => [f, field(f)?.value ?? ''])) as Record<Filter, string>;
    const sort = (field('sort')?.value || 'rank') as Sort;

    let visible = 0;
    for (const item of items) {
      const ok = FILTERS.every((f) => !active[f] || item.values[f].includes(active[f])) && (q.length === 0 || matches(item.search, q));
      item.el.hidden = !ok;
      if (ok) visible += 1;
    }

    const sorted = [...items].sort(comparators[sort] ?? comparators.rank);
    const order = sorted.map((i) => i.el.dataset.id).join(',');
    if (order !== lastOrder) {
      list!.append(...sorted.map((i) => i.el));
      lastOrder = order;
    }

    count!.textContent = `Найдено: ${countLabel(visible, ['объект', 'объекта', 'объектов'])}`;
    empty!.hidden = visible > 0;

    const next = new URLSearchParams();
    const qRaw = field('q')?.value.trim();
    if (qRaw) next.set('q', qRaw);
    for (const f of FILTERS) if (active[f]) next.set(f, active[f]);
    if (sort !== 'rank') next.set('sort', sort);
    const qs = next.toString();
    history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  }

  let timer: number | undefined;
  form.addEventListener('input', (e) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'search') {
      window.clearTimeout(timer);
      timer = window.setTimeout(apply, 120);
    } else {
      apply();
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    apply();
  });
  form.addEventListener('reset', () => window.setTimeout(apply, 0));
  root.querySelectorAll<HTMLButtonElement>('[data-reset-all]').forEach((b) => b.addEventListener('click', () => form.reset()));

  root.dataset.ready = 'true';
  apply();
}
