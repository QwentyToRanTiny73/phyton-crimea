import { NextResponse } from 'next/server';
import { createPayment } from '@/lib/payment/yookassa';
import { getOrder, updateOrderStatus } from '@/lib/orders';

interface PaymentRequestBody {
  orderId: string;
  amount: number;
  email?: string;
  phone?: string;
  returnUrl: string;
}

export async function POST(request: Request) {
  try {
    const body: PaymentRequestBody = await request.json();
    const { orderId, amount, email, phone, returnUrl } = body;

    if (!orderId || !amount || !returnUrl) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные параметры' },
        { status: 400 }
      );
    }

    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    const payment = await createPayment({
      amount,
      description: `Заказ ${orderId} — Фитон Крым`,
      orderId,
      returnUrl,
      customerEmail: email,
      customerPhone: phone,
    });

    // Update order with payment id
    updateOrderStatus(orderId, 'pending', payment.id);

    const paymentUrl = payment.confirmation?.confirmation_url;
    if (!paymentUrl) {
      throw new Error('ЮКасса не вернула URL для оплаты');
    }

    return NextResponse.json({ paymentUrl, paymentId: payment.id });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Ошибка создания платежа';
    console.error('Payment create error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
