/** Общие настройки сайта. Тексты бренда и параметры, которые редактор может менять без правки компонентов. */
export const SITE = {
  name: 'Южный берег',
  tagline: 'Гид по Большой Ялте',
  description:
    'Региональный справочник Южного берега Крыма: достопримечательности, организации, услуги и события Большой Ялты — в одном месте.',
  lang: 'ru',
  locale: 'ru_RU',
  /** Фото первого экрана и Open Graph по умолчанию (ID из src/data/photos.json). */
  heroPhoto: 'settlement-yalta',
  /**
   * Куда уходят предложения новых объектов. Задаются переменными окружения при сборке
   * (см. README): PUBLIC_SUGGEST_FORM_URL — внешняя форма, PUBLIC_SUGGEST_EMAIL — почта для mailto.
   */
  suggest: {
    email: import.meta.env.PUBLIC_SUGGEST_EMAIL ?? '',
    formUrl: import.meta.env.PUBLIC_SUGGEST_FORM_URL ?? '',
  },
} as const;
