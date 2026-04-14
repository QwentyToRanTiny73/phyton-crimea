import { Suspense } from 'react';
import { OrderDetails } from '@/components/order/OrderDetails';

// Server component shell — keeps SSR for layout while OrderDetails
// reads searchParams on the client via useSearchParams().
export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-400">Загрузка...</p>
        </div>
      }
    >
      <OrderDetails />
    </Suspense>
  );
}
