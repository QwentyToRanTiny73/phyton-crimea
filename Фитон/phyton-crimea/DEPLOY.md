# Развёртывание сайта Фитон Крым

Next.js 14 (SSR) — требует VPS с Node.js. GitHub Pages не подходит.

---

## Требования к серверу

| Параметр | Минимум | Рекомендуется |
|---|---|---|
| CPU | 1 ядро | 2 ядра |
| RAM | 1 ГБ | 2 ГБ |
| Диск | 10 ГБ SSD | 20 ГБ SSD |
| ОС | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

**Проверенные российские VPS-провайдеры:**
- [Selectel](https://selectel.ru) — Санкт-Петербург / Москва
- [Timeweb Cloud](https://timeweb.cloud)
- [Beget](https://beget.com)
- [REG.RU](https://www.reg.ru)

---

## Шаг 1 — Первичная настройка сервера

Выполните **один раз** от пользователя `root`:

```bash
ssh root@ВАШ_IP

# Скопируйте скрипт на сервер и запустите
chmod +x server-init.sh
./server-init.sh
```

Скрипт автоматически установит:
- Node.js 20 LTS
- PM2 (менеджер процессов)
- Nginx (веб-сервер / прокси)
- Certbot (SSL Let's Encrypt)
- UFW (файрволл)
- Пользователя `deploy`

---

## Шаг 2 — Клонирование репозитория

```bash
su - deploy

# Клонировать репозиторий
git clone https://github.com/QwentyToRanTiny73/Phyton-Crimea.git /var/www/phytoncrimea/repo

# Перейти в директорию проекта
cd /var/www/phytoncrimea/repo/Фитон/phyton-crimea
```

---

## Шаг 3 — Переменные окружения

```bash
cp .env.example .env.local
nano .env.local
```

Заполните обязательные значения:

```env
# ЮКасса — получить на https://yookassa.ru/my/merchant/integration/api
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Ozon — получить на https://seller.ozon.ru/app/settings/api-keys
OZON_CLIENT_ID=123456
OZON_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
OZON_CATEGORY_ID=6396

# Секрет для защиты /api/ozon/sync (придумайте сами)
API_SYNC_SECRET=ваш_случайный_секрет_32_символа

# URL вашего сайта
NEXT_PUBLIC_SITE_URL=https://phytoncrimea.ru
```

> **Важно:** `.env.local` никогда не попадает в git (исключён в `.gitignore`).

---

## Шаг 4 — Первый деплой

```bash
cd /var/www/phytoncrimea/repo/Фитон/phyton-crimea

# Установить зависимости
npm ci

# Собрать проект
npm run build

# Запустить через PM2
pm2 start ecosystem.config.js

# Сохранить конфигурацию PM2 (автозапуск после перезагрузки)
pm2 save

# Проверить статус
pm2 status
```

Сайт доступен на `http://ВАШ_IP:3000` (до настройки Nginx).

---

## Шаг 5 — Настройка домена

1. В DNS-панели регистратора создайте A-записи:

   | Имя | Тип | Значение |
   |---|---|---|
   | `@` | A | ВАШ_IP |
   | `www` | A | ВАШ_IP |

2. Дождитесь распространения DNS (до 24 часов, обычно 15–30 мин).

3. Проверьте:
   ```bash
   ping phytoncrimea.ru
   ```

---

## Шаг 6 — Nginx + SSL

```bash
# Скопировать конфиг (от root)
sudo cp /var/www/phytoncrimea/repo/Фитон/phyton-crimea/nginx/phytoncrimea.conf \
        /etc/nginx/sites-available/phytoncrimea.conf

# Заменить домен если нужно
sudo sed -i 's/phytoncrimea.ru/ВАШ_ДОМЕН/g' /etc/nginx/sites-available/phytoncrimea.conf

# Активировать сайт
sudo ln -sf /etc/nginx/sites-available/phytoncrimea.conf \
            /etc/nginx/sites-enabled/phytoncrimea.conf

# Убрать дефолтный сайт Nginx
sudo rm -f /etc/nginx/sites-enabled/default

# Проверить конфиг
sudo nginx -t

# Перезагрузить (пока без SSL — HTTP)
sudo systemctl reload nginx
```

Получить SSL-сертификат:

```bash
sudo certbot --nginx -d phytoncrimea.ru -d www.phytoncrimea.ru \
    --email info@phytoncrimea.ru --agree-tos --no-eff-email
```

Certbot автоматически обновит конфиг Nginx для HTTPS.

Автопродление проверить:
```bash
sudo certbot renew --dry-run
```

---

## Шаг 7 — Настройка ЮКассы

В [личном кабинете ЮКассы](https://yookassa.ru/my/merchant/integration/http-notifications) добавьте URL webhook:

```
https://phytoncrimea.ru/api/payment/webhook
```

События для подписки:
- `payment.succeeded`
- `payment.canceled`

---

## Автоматический деплой (CI/CD)

### Вариант A — GitHub Actions (при наличии доступа к GitHub)

1. Добавьте Secrets в репозитории (`Settings → Secrets → Actions`):

   | Secret | Значение |
   |---|---|
   | `VPS_HOST` | IP-адрес вашего VPS |
   | `VPS_USER` | `deploy` |
   | `VPS_SSH_KEY` | Приватный SSH-ключ (`cat ~/.ssh/id_rsa`) |
   | `VPS_PORT` | `22` (или другой) |

2. При каждом `git push` в `main` GitHub Actions автоматически задеплоит обновление.

3. Смотреть прогресс: вкладка **Actions** в репозитории.

### Вариант B — Ручной деплой с сервера

```bash
ssh deploy@ВАШ_IP
cd /var/www/phytoncrimea/repo/Фитон/phyton-crimea
./scripts/deploy.sh main
```

---

## Управление процессом (PM2)

```bash
# Статус
pm2 status

# Логи в реальном времени
pm2 logs phyton-crimea

# Перезапуск (с небольшим даунтаймом)
pm2 restart phyton-crimea

# Плавный перезапуск (zero-downtime)
pm2 reload phyton-crimea

# Остановить
pm2 stop phyton-crimea

# Информация о процессе
pm2 show phyton-crimea

# Мониторинг в реальном времени
pm2 monit
```

---

## Синхронизация с Ozon

Запустить синхронизацию товаров вручную:

```bash
curl -X POST https://phytoncrimea.ru/api/ozon/sync \
     -H "Authorization: Bearer ВАШ_API_SYNC_SECRET" \
     -H "Content-Type: application/json" \
     -d '{}'
```

Синхронизировать только одну категорию:

```bash
curl -X POST https://phytoncrimea.ru/api/ozon/sync \
     -H "Authorization: Bearer ВАШ_API_SYNC_SECRET" \
     -H "Content-Type: application/json" \
     -d '{"category": "face"}'
```

Добавить в cron для автоматической синхронизации (раз в день):

```bash
crontab -e
# Добавить строку:
0 3 * * * curl -sf -X POST https://phytoncrimea.ru/api/ozon/sync \
  -H "Authorization: Bearer ВАШ_СЕКРЕТ" -H "Content-Type: application/json" -d '{}' \
  >> /var/log/ozon-sync.log 2>&1
```

---

## Мониторинг и логи

```bash
# Логи приложения
pm2 logs phyton-crimea --lines 100

# Логи Nginx
sudo tail -f /var/log/nginx/phytoncrimea-access.log
sudo tail -f /var/log/nginx/phytoncrimea-error.log

# Загрузка сервера
htop

# Место на диске
df -h

# Проверить SSL
echo | openssl s_client -connect phytoncrimea.ru:443 2>/dev/null | openssl x509 -noout -dates
```

---

## Обновление на production (production БД)

Для хранения заказов в production следует заменить in-memory хранилище на PostgreSQL:

```bash
# На сервере
npm install prisma @prisma/client

# В .env.local добавить
DATABASE_URL="postgresql://user:password@localhost:5432/phytoncrimea"

# Создать схему Prisma
npx prisma init
npx prisma migrate dev --name init
```

---

## Типичные проблемы

| Проблема | Решение |
|---|---|
| Порт 3000 занят | `pm2 delete phyton-crimea && pm2 start ecosystem.config.js` |
| Nginx 502 Bad Gateway | Проверить `pm2 status` — приложение должно быть `online` |
| SSL не выдаётся | Убедиться, что домен указывает на VPS и порт 80 открыт |
| Сборка упала: нет памяти | Увеличить RAM или добавить swap: `fallocate -l 2G /swapfile` |
| Переменные не читаются | `.env.local` должен быть в `Фитон/phyton-crimea/`, не в корне |
