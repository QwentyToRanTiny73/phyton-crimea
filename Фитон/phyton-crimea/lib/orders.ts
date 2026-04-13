/**
 * Хранилище заказов — файловое (JSON на диске).
 *
 * Почему не in-memory Map:
 *   - PM2 cluster mode: каждый воркер имеет свою память — заказы не видны между процессами.
 *   - Перезапуск сервера: in-memory данные теряются.
 *
 * Текущая реализация: JSON-файл в .orders/orders.json
 *   - Подходит для небольшого магазина (тысячи заказов ≈ несколько МБ)
 *   - Файл исключён из git через .gitignore
 *
 * Для высокой нагрузки замените на PostgreSQL + Prisma:
 *   npm install prisma @prisma/client
 *   npx prisma init
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { Order } from '@/types';

const ORDERS_DIR = join(process.cwd(), '.orders');
const ORDERS_FILE = join(ORDERS_DIR, 'orders.json');

function ensureDir(): void {
  if (!existsSync(ORDERS_DIR)) {
    mkdirSync(ORDERS_DIR, { recursive: true });
  }
}

function readAll(): Record<string, Order> {
  try {
    ensureDir();
    if (!existsSync(ORDERS_FILE)) return {};
    return JSON.parse(readFileSync(ORDERS_FILE, 'utf-8')) as Record<string, Order>;
  } catch {
    return {};
  }
}

function writeAll(orders: Record<string, Order>): void {
  ensureDir();
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

export function saveOrder(order: Order): void {
  const orders = readAll();
  orders[order.id] = order;
  writeAll(orders);
}

export function getOrder(id: string): Order | undefined {
  return readAll()[id];
}

export function updateOrderStatus(
  id: string,
  status: Order['status'],
  paymentId?: string
): Order | undefined {
  const orders = readAll();
  const order = orders[id];
  if (!order) return undefined;
  orders[id] = { ...order, status, ...(paymentId && { paymentId }) };
  writeAll(orders);
  return orders[id];
}

export function getAllOrders(): Order[] {
  return Object.values(readAll()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
