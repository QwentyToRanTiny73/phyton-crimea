/** Ключи иконок, которые можно указывать в данных (категории, типы услуг, категории событий). */
export const ICON_KEYS = [
  'bed-double',
  'utensils-crossed',
  'landmark',
  'mountain',
  'compass',
  'footprints',
  'sailboat',
  'calendar-days',
  'hammer',
  'concierge-bell',
  'guitar',
  'party-popper',
  'frame',
  'palette',
  'trophy',
  'route',
] as const;

export type IconKey = (typeof ICON_KEYS)[number];
