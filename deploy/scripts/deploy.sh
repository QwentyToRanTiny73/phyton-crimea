#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Деплой / обновление Фитон Крым на VPS
# =============================================================================
# Запускать от пользователя deploy на сервере при каждом обновлении.
#
# Использование:
#   ./scripts/deploy.sh                  # деплой текущей ветки
#   ./scripts/deploy.sh main             # явно указать ветку
#   ./scripts/deploy.sh main --skip-pull # пересобрать без git pull
# =============================================================================

set -euo pipefail

# ── Настройки (при необходимости измените) ────────────────────────────────────
APP_DIR="/var/www/phytoncrimea/repo"
PM2_APP_NAME="phyton-crimea"
BRANCH="${1:-main}"
SKIP_PULL="${2:-}"
# ─────────────────────────────────────────────────────────────────────────────

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()    { echo -e "${GREEN}[✓]${NC} $*"; }
step()    { echo -e "${CYAN}[→]${NC} $*"; }
warn()    { echo -e "${YELLOW}[!]${NC} $*"; }
error()   { echo -e "${RED}[✗]${NC} $*"; exit 1; }
divider() { echo -e "${CYAN}────────────────────────────────────────────────${NC}"; }

START_TIME=$(date +%s)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

divider
echo -e "  ${GREEN}Фитон Крым — деплой${NC}  •  ${TIMESTAMP}"
divider

# ── Проверки ──────────────────────────────────────────────────────────────────
[[ -d "${APP_DIR}" ]] || error "Директория ${APP_DIR} не найдена. Запустите server-init.sh"
command -v node &>/dev/null || error "Node.js не установлен"
command -v pm2 &>/dev/null  || error "PM2 не установлен (npm install -g pm2)"

cd "${APP_DIR}"

# ── 1. Git pull ───────────────────────────────────────────────────────────────
if [[ "${SKIP_PULL}" != "--skip-pull" ]]; then
    step "Получение обновлений (ветка: ${BRANCH})..."
    git fetch --all
    git checkout "${BRANCH}"
    git reset --hard "origin/${BRANCH}"
    COMMIT_SHA=$(git rev-parse --short HEAD)
    COMMIT_MSG=$(git log -1 --pretty=format:'%s')
    info "Обновлено до коммита ${COMMIT_SHA}: ${COMMIT_MSG}"
else
    warn "Пропуск git pull (--skip-pull)"
    COMMIT_SHA=$(git rev-parse --short HEAD)
fi

# ── 2. Зависимости ───────────────────────────────────────────────────────────
step "Установка зависимостей..."
npm ci --prefer-offline 2>&1 | tail -3
info "Зависимости установлены"

# ── 3. Проверка .env.local ────────────────────────────────────────────────────
if [[ ! -f ".env.local" ]]; then
    warn ".env.local не найден!"
    warn "Скопируйте: cp .env.example .env.local && nano .env.local"
    warn "Продолжаем деплой без переменных окружения..."
fi

# ── 4. Сборка ─────────────────────────────────────────────────────────────────
step "Сборка Next.js..."
npm run build 2>&1 | tail -10
info "Сборка завершена"

# ── 5. PM2 — zero-downtime reload ────────────────────────────────────────────
step "Обновление процесса PM2..."
if pm2 describe "${PM2_APP_NAME}" &>/dev/null; then
    # Приложение уже запущено — плавный перезапуск без даунтайма
    pm2 reload "${PM2_APP_NAME}" --update-env
    info "Процесс ${PM2_APP_NAME} перезапущен (zero-downtime)"
else
    # Первый запуск
    pm2 start ecosystem.config.js
    pm2 save
    info "Процесс ${PM2_APP_NAME} запущен впервые и сохранён"
fi

# ── 6. Проверка здоровья ──────────────────────────────────────────────────────
step "Проверка работоспособности..."
sleep 3  # Ждём запуска

MAX_RETRIES=5
RETRY=0
until curl -sf http://localhost:3000 > /dev/null 2>&1; do
    RETRY=$((RETRY + 1))
    if [[ ${RETRY} -ge ${MAX_RETRIES} ]]; then
        error "Приложение не отвечает на localhost:3000 после ${MAX_RETRIES} попыток!"
    fi
    warn "Попытка ${RETRY}/${MAX_RETRIES} — ждём ещё 3 сек..."
    sleep 3
done
info "Приложение отвечает на localhost:3000"

# ── 7. Итог ───────────────────────────────────────────────────────────────────
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

divider
info "Деплой завершён за ${DURATION} сек."
echo -e "  Коммит:  ${CYAN}${COMMIT_SHA}${NC}"
echo -e "  Статус:  $(pm2 describe ${PM2_APP_NAME} | grep -oP 'status\s+\K\S+' | head -1)"
divider

# Показать статус PM2
pm2 status "${PM2_APP_NAME}"
