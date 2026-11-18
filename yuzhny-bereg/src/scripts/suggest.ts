/**
 * Форма «Предложить объект». Бэкенда нет, поэтому данные нигде не сохраняются:
 * скрипт собирает текст заявки, открывает почтовый клиент (если задан адрес редакции)
 * и показывает текст для копирования — его можно отправить любым удобным способом.
 */
export function initSuggest(form: HTMLFormElement): void {
  const output = document.querySelector<HTMLElement>('[data-suggest-result]');
  const text = document.querySelector<HTMLTextAreaElement>('[data-suggest-text]');
  const mailLink = document.querySelector<HTMLAnchorElement>('[data-suggest-mail]');
  const copyBtn = document.querySelector<HTMLButtonElement>('[data-suggest-copy]');
  const copyStatus = document.querySelector<HTMLElement>('[data-copy-status]');
  const email = form.dataset.email ?? '';
  if (!output || !text) return;

  const typeSelect = form.querySelector<HTMLSelectElement>('select[name="type"]');
  const dates = form.querySelector<HTMLElement>('[data-event-fields]');
  const syncType = () => {
    if (typeSelect && dates) dates.hidden = typeSelect.value !== 'Событие';
  };
  typeSelect?.addEventListener('change', syncType);
  syncType();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines: string[] = [];
    form.querySelectorAll<HTMLElement>('[data-label]').forEach((el) => {
      const name = el.getAttribute('name');
      if (!name || el.closest('[hidden]')) return;
      const value = String(data.get(name) ?? '').trim();
      if (value && name !== 'consent') lines.push(`${el.dataset.label}: ${value}`);
    });
    const title = String(data.get('title') ?? '').trim();
    const body = `Предложение для каталога «Южный берег»\n\n${lines.join('\n')}\n`;
    text.value = body;
    output.hidden = false;

    if (email && mailLink) {
      const href = `mailto:${email}?subject=${encodeURIComponent(`Новый объект: ${title}`)}&body=${encodeURIComponent(body)}`;
      mailLink.href = href;
      mailLink.hidden = false;
      window.location.href = href;
    }
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    text.focus({ preventScroll: true });
  });

  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text.value);
      if (copyStatus) copyStatus.textContent = 'Текст скопирован';
    } catch {
      text.select();
      if (copyStatus) copyStatus.textContent = 'Выделите текст и скопируйте вручную';
    }
  });
}
