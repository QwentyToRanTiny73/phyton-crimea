import type { LegalForm, ListingKind, SettlementKind, SocialNetwork } from '@/types/domain';

/** Даты в данных хранятся без времени (полночь UTC), поэтому форматируем в UTC. */
const dateLong = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const dateDayMonth = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const weekdayShort = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', timeZone: 'UTC' });
const monthShort = new Intl.DateTimeFormat('ru-RU', { month: 'short', timeZone: 'UTC' });

export const formatDate = (d: Date): string => dateLong.format(d).replace(/\s*г\.$/, '');
export const formatDayMonth = (d: Date): string => dateDayMonth.format(d);
export const formatWeekday = (d: Date): string => weekdayShort.format(d);
export const formatMonthShort = (d: Date): string => monthShort.format(d).replace('.', '');
export const isoDate = (d: Date): string => d.toISOString().slice(0, 10);

export function formatDateRange(start: Date, end?: Date): string {
  if (!end || isoDate(end) === isoDate(start)) return formatDate(start);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  return `${sameYear ? formatDayMonth(start) : formatDate(start)} — ${formatDate(end)}`;
}

export function formatTimeRange(start?: string, end?: string): string | undefined {
  if (!start) return undefined;
  return end ? `${start}–${end}` : start;
}

/** Склонение по числу: plural(5, ['объект', 'объекта', 'объектов']). */
export function plural(n: number, forms: readonly [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export const countLabel = (n: number, forms: readonly [string, string, string]): string => `${n} ${plural(n, forms)}`;

export const KIND_LABEL: Record<ListingKind, string> = {
  place: 'Место',
  organization: 'Организация',
  service: 'Услуга',
};

export const LEGAL_FORM_LABEL: Record<LegalForm, string> = {
  company: 'Компания',
  'sole-proprietor': 'Индивидуальный предприниматель',
  'self-employed': 'Самозанятый',
  nonprofit: 'Некоммерческая организация',
  state: 'Государственное учреждение',
};

export const SETTLEMENT_KIND_LABEL: Record<SettlementKind, string> = {
  город: 'Город',
  посёлок: 'Посёлок',
  село: 'Село',
};

export const SOCIAL_LABEL: Record<SocialNetwork, string> = {
  telegram: 'Telegram',
  vk: 'ВКонтакте',
  max: 'MAX',
  ok: 'Одноклассники',
  whatsapp: 'WhatsApp',
  youtube: 'YouTube',
  instagram: 'Instagram',
  other: 'Ссылка',
};

export const phoneHref = (phone: string): string => `tel:${phone.replace(/[^\d+]/g, '')}`;

export const hostname = (u: string): string => {
  try {
    return new URL(u).hostname.replace(/^www\./, '');
  } catch {
    return u;
  }
};

/** Обрезка текста для meta description. */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:—-]+$/, '')}…`;
}
