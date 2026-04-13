// PM2 Ecosystem Config — Фитон Крым
// Документация: https://pm2.keymetrics.io/docs/usage/application-declaration/
//
// Запуск:    pm2 start ecosystem.config.js
// Перезапуск: pm2 reload phyton-crimea
// Статус:    pm2 status
// Логи:      pm2 logs phyton-crimea

module.exports = {
  apps: [
    {
      name: 'phyton-crimea',

      // Запускаем через next start
      script: 'node_modules/.bin/next',
      args: 'start',

      // Рабочая директория на сервере (измените под свой путь)
      cwd: '/var/www/phytoncrimea/Фитон/phyton-crimea',

      // ВАЖНО: используем fork (1 процесс), а не cluster.
      // Причина: хранилище заказов (.orders/orders.json) — файловое,
      // и при cluster mode возможны race conditions при одновременных заказах.
      // Для cluster mode необходимо перейти на PostgreSQL + Prisma.
      instances: 1,
      exec_mode: 'fork',

      // Перезапуск при утечке памяти
      max_memory_restart: '512M',

      // Переменные окружения production
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Файлы логов
      error_file: '/var/log/pm2/phyton-crimea-error.log',
      out_file:   '/var/log/pm2/phyton-crimea-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',

      // Автоматический перезапуск при падении
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,

      // Graceful reload — 0-downtime при обновлении
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,

      watch: false,
    },
  ],
};
