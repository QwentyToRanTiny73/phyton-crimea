import { NextResponse } from 'next/server';
import { saveOrder } from '@/lib/orders';
import { generateOrderId } from '@/lib/utils';
import type { CartItem, CheckoutFormData, Order } from '@/types';

interface OrderRequestBody {
  items: CartItem[];
  total: number;
  customer: CheckoutFormData;
}

export async function POST(request: Request) {
  try {
    const body: OrderRequestBody = await request.json();
    const { items, total, customer } = body;

    if (!items?.length || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { error: 'Не заполнены обязательные поля' },
        { status: 400 }
      );
    }

    const order: Order = {
      id: generateOrderId(),
      items,
      total,
      customerName: `${customer.firstName} ${customer.lastName}`.trim(),
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode,
      comment: customer.comment,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);

    return NextResponse.json({ orderId: order.id, status: 'pending' });
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
