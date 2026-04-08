/**
 * Хранилище заказов.
 *
 * MVP: заказы хранятся в памяти (in-memory Map).
 * Для production рекомендуется заменить на PostgreSQL + Prisma:
 *   npm install prisma @prisma/client
 *   npx prisma init
 */

import type { Order } from '@/types';

// In-memory store (для production используйте БД)
const ordersMap = new Map<string, Order>();

export function saveOrder(order: Order): void {
  ordersMap.set(order.id, order);
}

export function getOrder(id: string): Order | undefined {
  return ordersMap.get(id);
}

export function updateOrderStatus(
  id: string,
  status: Order['status'],
  paymentId?: string
): Order | undefined {
  const order = ordersMap.get(id);
  if (!order) return undefined;
  const updated: Order = { ...order, status, ...(paymentId && { paymentId }) };
  ordersMap.set(id, updated);
  return updated;
}

export function getAllOrders(): Order[] {
  return Array.from(ordersMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
