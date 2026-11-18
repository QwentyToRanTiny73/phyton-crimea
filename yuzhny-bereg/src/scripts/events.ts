/**
 * Фильтрация афиши на клиенте: по категории, периоду и конкретной дате.
 * «Сегодня» определяется по московскому времени (часовой пояс Крыма), а не по часам посетителя.
 */
import { countLabel } from '@/lib/format';

type Period = 'upcoming' | 'today' | 'weekend' | 'week' | 'month' | 'past' | 'all';

const DAY = 86_400_000;

export function todayInCrimea(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

const toDate = (iso: string): Date => new Date(`${iso}T00:00:00Z`);
const toIso = (d: Date): string => d.toISOString().slice(0, 10);
const addDays = (iso: string, n: number): string => toIso(new Date(toDate(iso).getTime() + n * DAY));

function range(period: Period, today: string): [string, string] | null {
  switch (period) {
    case 'today':
      return [today, today];
    case 'week':
      return [today, addDays(today, 6)];
    case 'month':
      return [today, addDays(today, 29)];
    case 'weekend': {
      const dow = toDate(today).getUTCDay(); // 0 — воскресенье, 6 — суббота
      if (dow === 0) return [today, today];
      const saturday = addDays(today, (6 - dow + 7) % 7);
      return [saturday, addDays(saturday, 1)];
    }
    case 'upcoming':
      return [today, '9999-12-31'];
    case 'past':
      return ['0000-01-01', addDays(today, -1)];
    case 'all':
      return null;
  }
}

/** Помечает прошедшие события бейджем «Прошло». Возвращает признак для каждого элемента. */
export function markPast(root: ParentNode, today = todayInCrimea()): void {
  root.querySelectorAll<HTMLElement>('[data-event]').forEach((el) => {
    const end = el.dataset.end ?? el.dataset.start ?? '';
    const past = end < today;
    el.dataset.past = String(past);
    el.querySelectorAll<HTMLElement>('[data-past-badge]').forEach((b) => (b.hidden = !past));
  });
}

/** Для блоков-анонсов: скрывает прошедшие события и показывает заглушку, если ничего не осталось. */
export function hidePast(root: HTMLElement): void {
  const today = todayInCrimea();
  markPast(root, today);
  let visible = 0;
  root.querySelectorAll<HTMLElement>('[data-event]').forEach((el) => {
    el.hidden = el.dataset.past === 'true';
    if (!el.hidden) visible += 1;
  });
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  if (empty) empty.hidden = visible > 0;
}

export function initEvents(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-events-form]');
  const list = root.querySelector<HTMLElement>('[data-results]');
  const count = root.querySelector<HTMLElement>('[data-count]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  if (!form || !list || !count || !empty) return;

  const today = todayInCrimea();
  markPast(root, today);
  const items = Array.from(list.querySelectorAll<HTMLElement>('[data-event]'));
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | RadioNodeList | null;

  const params = new URLSearchParams(window.location.search);
  const cat = params.get('category');
  if (cat) {
    const radio = form.querySelector<HTMLInputElement>(`input[name="category"][value="${CSS.escape(cat)}"]`);
    if (radio) radio.checked = true;
  }
  const period = params.get('period');
  const periodEl = field('period');
  if (period && periodEl instanceof HTMLSelectElement && Array.from(periodEl.options).some((o) => o.value === period)) periodEl.value = period;
  const date = params.get('date');
  const dateEl = field('date');
  if (date && dateEl instanceof HTMLInputElement && /^\d{4}-\d{2}-\d{2}$/.test(date)) dateEl.value = date;

  function apply(): void {
    const category = (form!.querySelector<HTMLInputElement>('input[name="category"]:checked')?.value ?? '') as string;
    const p = ((periodEl instanceof HTMLSelectElement ? periodEl.value : 'upcoming') || 'upcoming') as Period;
    const exact = dateEl instanceof HTMLInputElement ? dateEl.value : '';
    const r: [string, string] | null = exact ? [exact, exact] : range(p, today);

    let visible = 0;
    for (const el of items) {
      const start = el.dataset.start ?? '';
      const end = el.dataset.end ?? start;
      const inRange = !r || (start <= r[1] && end >= r[0]);
      const ok = inRange && (!category || el.dataset.category === category);
      el.hidden = !ok;
      if (ok) visible += 1;
    }

    // Прошедшие показываем от новых к старым, остальные — по возрастанию даты.
    const desc = !exact && p === 'past';
    const sorted = [...items].sort((a, b) => {
      const cmp = (a.dataset.start ?? '').localeCompare(b.dataset.start ?? '');
      return desc ? -cmp : cmp;
    });
    list!.append(...sorted);

    count!.textContent = `Найдено: ${countLabel(visible, ['событие', 'события', 'событий'])}`;
    empty!.hidden = visible > 0;

    const next = new URLSearchParams();
    if (category) next.set('category', category);
    if (p !== 'upcoming') next.set('period', p);
    if (exact) next.set('date', exact);
    const qs = next.toString();
    history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  }

  form.addEventListener('change', (e) => {
    // Выбор периода сбрасывает конкретную дату, и наоборот.
    if (e.target === periodEl && dateEl instanceof HTMLInputElement) dateEl.value = '';
    apply();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    apply();
  });
  form.addEventListener('reset', () => window.setTimeout(apply, 0));
  root.querySelectorAll<HTMLButtonElement>('[data-reset-all]').forEach((b) => b.addEventListener('click', () => form.reset()));
  apply();
}
