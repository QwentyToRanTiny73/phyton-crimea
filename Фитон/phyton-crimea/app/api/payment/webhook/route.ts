import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/orders';

/**
 * ЮКасса Webhook
 *
 * Настройте URL webhook'а в личном кабинете ЮКассы:
 *   https://yookassa.ru/my/merchant/integration/http-notifications
 *
 * URL: https://your-domain.ru/api/payment/webhook
 * Событие: payment.succeeded, payment.canceled
 *
 * Для безопасности рекомендуется проверять IP ЮКассы:
 * https://yookassa.ru/developers/using-api/webhooks#ip
 */

interface YooKassaWebhookEvent {
  type: string;
  event: string;
  object: {
    id: string;
    status: string;
    paid: boolean;
    metadata?: { orderId?: string };
  };
}

export async function POST(request: Request) {
  try {
    const event: YooKassaWebhookEvent = await request.json();

    const paymentId = event.object?.id;
    const orderId = event.object?.metadata?.orderId;

    if (!orderId) {
      // No order linked — ignore silently
      return NextResponse.json({ ok: true });
    }

    switch (event.event) {
      case 'payment.succeeded':
        updateOrderStatus(orderId, 'paid', paymentId);
        console.log(`Order ${orderId} marked as paid (payment ${paymentId})`);
        break;

      case 'payment.canceled':
        updateOrderStatus(orderId, 'cancelled', paymentId);
        console.log(`Order ${orderId} cancelled (payment ${paymentId})`);
        break;

      default:
        // Other events (refund.succeeded, etc.) — log only
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
