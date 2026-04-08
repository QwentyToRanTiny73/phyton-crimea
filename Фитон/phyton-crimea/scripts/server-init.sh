#!/usr/bin/env bash
# =============================================================================
# server-init.sh — Первичная настройка VPS для Фитон Крым
# =============================================================================
# Запускать ОДИН РАЗ от пользователя root на чистом Ubuntu 22.04 LTS.
#
# Использование:
#   ssh root@YOUR_SERVER_IP
#   bash <(curl -sS https://raw.githubusercontent.com/YOUR_ORG/Phyton-Crimea/main/\
#         Фитон/phyton-crimea/scripts/server-init.sh)
#
# ИЛИ скопируйте файл на сервер и выполните:
#   chmod +x server-init.sh && ./server-init.sh
# =============================================================================

set -euo pipefail

# ── Настраиваемые параметры ───────────────────────────────────────────────────
DEPLOY_USER="deploy"           # Пользователь для деплоя (не root)
APP_DIR="/var/www/phytoncrimea" # Директория приложения
NODE_VERSION="20"              # Версия Node.js LTS
DOMAIN="phytoncrimea.ru"       # Ваш домен
# ─────────────────────────────────────────────────────────────────────────────

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

[[ $EUID -ne 0 ]] && error "Скрипт должен запускаться от root"

# ── 1. Обновление системы ─────────────────────────────────────────────────────
info "Обновление пакетов системы..."
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq \
    curl wget git unzip ufw \
    build-essential ca-certificates gnupg lsb-release

# ── 2. Node.js 20 LTS ─────────────────────────────────────────────────────────
info "Установка Node.js ${NODE_VERSION} LTS..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt-get install -y -qq nodejs
node -v && npm -v
info "Node.js $(node -v) установлен"

# ── 3. PM2 — менеджер процессов ───────────────────────────────────────────────
info "Установка PM2..."
npm install -g pm2@latest
pm2 --version

# Автозапуск PM2 при перезагрузке сервера
pm2 startup systemd -u ${DEPLOY_USER} --hp /home/${DEPLOY_USER} || true

# ── 4. Nginx ──────────────────────────────────────────────────────────────────
info "Установка Nginx..."
apt-get install -y -qq nginx
systemctl enable nginx
systemctl start nginx
nginx -v

# ── 5. Certbot — SSL сертификаты (Let's Encrypt) ──────────────────────────────
info "Установка Certbot..."
snap install --classic certbot 2>/dev/null || apt-get install -y -qq certbot python3-certbot-nginx
ln -sf /snap/bin/certbot /usr/bin/certbot 2>/dev/null || true

# ── 6. Firewall (UFW) ─────────────────────────────────────────────────────────
info "Настройка файрволла..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status

# ── 7. Директории для логов PM2 ───────────────────────────────────────────────
info "Создание директорий..."
mkdir -p /var/log/pm2
mkdir -p ${APP_DIR}

# ── 8. Пользователь deploy ────────────────────────────────────────────────────
if ! id "${DEPLOY_USER}" &>/dev/null; then
    info "Создание пользователя ${DEPLOY_USER}..."
    adduser --disabled-password --gecos "" ${DEPLOY_USER}
    usermod -aG sudo ${DEPLOY_USER}
    # Разрешить sudo без пароля только для pm2
    echo "${DEPLOY_USER} ALL=(ALL) NOPASSWD: /usr/bin/pm2, /usr/sbin/nginx" \
        >> /etc/sudoers.d/${DEPLOY_USER}
else
    warn "Пользователь ${DEPLOY_USER} уже существует — пропускаем"
fi

# SSH ключи для пользователя deploy
mkdir -p /home/${DEPLOY_USER}/.ssh
chmod 700 /home/${DEPLOY_USER}/.ssh

if [[ -f /root/.ssh/authorized_keys ]]; then
    cp /root/.ssh/authorized_keys /home/${DEPLOY_USER}/.ssh/authorized_keys
    chmod 600 /home/${DEPLOY_USER}/.ssh/authorized_keys
fi

chown -R ${DEPLOY_USER}:${DEPLOY_USER} /home/${DEPLOY_USER}/.ssh
chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${APP_DIR}

# ── 9. Клонирование репозитория ───────────────────────────────────────────────
info "Готово! Следующие шаги:"
echo ""
echo "  1. Клонируйте репозиторий:"
echo "     su - ${DEPLOY_USER}"
echo "     git clone https://github.com/QwentyToRanTiny73/Phyton-Crimea.git ${APP_DIR}/repo"
echo ""
echo "  2. Настройте переменные окружения:"
echo "     cp ${APP_DIR}/repo/Фитон/phyton-crimea/.env.example \\"
echo "        ${APP_DIR}/repo/Фитон/phyton-crimea/.env.local"
echo "     nano ${APP_DIR}/repo/Фитон/phyton-crimea/.env.local"
echo ""
echo "  3. Первый деплой:"
echo "     cd ${APP_DIR}/repo/Фитон/phyton-crimea"
echo "     npm ci"
echo "     npm run build"
echo "     pm2 start ecosystem.config.js"
echo "     pm2 save"
echo ""
echo "  4. Настройте Nginx:"
echo "     cp nginx/phytoncrimea.conf /etc/nginx/sites-available/${DOMAIN}.conf"
echo "     # Замените phytoncrimea.ru на ваш домен в конфиге"
echo "     ln -s /etc/nginx/sites-available/${DOMAIN}.conf /etc/nginx/sites-enabled/"
echo "     nginx -t && systemctl reload nginx"
echo ""
echo "  5. Выпустите SSL сертификат:"
echo "     certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo ""
info "Сервер настроен успешно!"
