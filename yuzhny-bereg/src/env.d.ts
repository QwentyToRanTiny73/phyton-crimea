interface ImportMetaEnv {
  /** Адрес почты редакции для формы «Предложить объект» (mailto). */
  readonly PUBLIC_SUGGEST_EMAIL?: string;
  /** Внешняя форма (например, Яндекс Формы или Google Forms) — используется вместо mailto, если задана. */
  readonly PUBLIC_SUGGEST_FORM_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
