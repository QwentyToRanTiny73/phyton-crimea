/**
 * Нормализация текста для клиентского поиска. Используется и при сборке (индекс в data-атрибутах),
 * и в браузере (запрос пользователя), поэтому функции не должны зависеть от окружения.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»"'`’()[\]{}.,:;!?/\\|+*—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokens(query: string): string[] {
  return normalize(query).split(' ').filter((t) => t.length > 0);
}

/** Все токены запроса должны входить в индексируемый текст (поиск по началу слов и подстрокам). */
export function matches(haystack: string, queryTokens: readonly string[]): boolean {
  return queryTokens.every((t) => haystack.includes(t));
}
