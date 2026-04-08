import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

interface Props {
  searchParams: { orderId?: string };
}

export default function OrderSuccessPage({ searchParams }: Props) {
  const orderId = searchParams.orderId ?? 'неизвестен';

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </div>

      <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Заказ оплачен!
      </h1>

      <p className="text-gray-500 text-lg leading-relaxed mb-6">
        Спасибо за покупку! Ваш заказ успешно оформлен и оплачен.
        Мы отправим вам письмо с подтверждением на указанный email.
      </p>

      <div className="bg-brand-beige rounded-2xl p-6 mb-8 inline-block text-left w-full">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-5 h-5 text-brand-green" />
          <span className="font-semibold text-gray-800">Информация о заказе</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Номер заказа:</span>
            <span className="font-medium text-gray-800">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Статус:</span>
            <span className="font-medium text-green-600">Оплачен</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Доставка:</span>
            <span className="font-medium text-gray-800">Почта России / СДЭК</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-8">
        Срок обработки: 1–2 рабочих дня. Срок доставки зависит от вашего региона.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-brand-green text-white font-medium px-8 py-4 rounded-full hover:bg-brand-green-dark transition-colors"
        >
          Продолжить покупки
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border-2 border-brand-green text-brand-green font-medium px-8 py-4 rounded-full hover:bg-brand-green hover:text-white transition-colors"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
