/**
 * ЮКасса (YooKassa) — платёжный шлюз, поддерживающий карты Мир, Visa, Mastercard,
 * СБП и другие способы оплаты.
 *
 * Документация: https://yookassa.ru/developers/api
 *
 * Для подключения необходимо:
 * 1. Зарегистрироваться на https://yookassa.ru/
 * 2. Получить YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY в личном кабинете
 * 3. Указать URL webhook'а: {YOUR_DOMAIN}/api/payment/webhook
 */

export interface YooKassaPaymentRequest {
  amount: number;
  currency?: string;
  description: string;
  orderId: string;
  returnUrl: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface YooKassaPayment {
  id: string;
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
  paid: boolean;
  amount: {
    value: string;
    currency: string;
  };
  confirmation?: {
    type: string;
    confirmation_url: string;
  };
  created_at: string;
  description: string;
  metadata?: Record<string, string>;
}

function getAuthHeader(): string {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;
  if (!shopId || !secretKey) {
    throw new Error('YooKassa credentials not configured');
  }
  return 'Basic ' + Buffer.from(`${shopId}:${secretKey}`).toString('base64');
}

function generateIdempotenceKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Создать платёж в ЮКассе
 */
export async function createPayment(
  req: YooKassaPaymentRequest
): Promise<YooKassaPayment> {
  const body: Record<string, unknown> = {
    amount: {
      value: req.amount.toFixed(2),
      currency: req.currency ?? 'RUB',
    },
    confirmation: {
      type: 'redirect',
      return_url: req.returnUrl,
    },
    capture: true,
    description: req.description,
    metadata: {
      orderId: req.orderId,
    },
  };

  // Данные для фискального чека (если нужна онлайн-касса)
  if (req.customerEmail || req.customerPhone) {
    body.receipt = {
      customer: {
        ...(req.customerEmail && { email: req.customerEmail }),
        ...(req.customerPhone && { phone: req.customerPhone }),
      },
      items: [
        {
          description: req.description,
          quantity: '1.00',
          amount: {
            value: req.amount.toFixed(2),
            currency: req.currency ?? 'RUB',
          },
          vat_code: 1, // НДС не облагается
          payment_mode: 'full_payment',
          payment_subject: 'commodity',
        },
      ],
    };
  }

  const response = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
      'Idempotence-Key': generateIdempotenceKey(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`YooKassa error ${response.status}: ${error}`);
  }

  return response.json() as Promise<YooKassaPayment>;
}

/**
 * Получить статус платежа
 */
export async function getPayment(paymentId: string): Promise<YooKassaPayment> {
  const response = await fetch(
    `https://api.yookassa.ru/v3/payments/${paymentId}`,
    {
      headers: {
        Authorization: getAuthHeader(),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`YooKassa error ${response.status}`);
  }

  return response.json() as Promise<YooKassaPayment>;
}
