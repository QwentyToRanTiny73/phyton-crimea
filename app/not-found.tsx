import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-brand-gold font-medium tracking-widest text-sm uppercase mb-4">404</p>
      <h1 className="font-serif text-5xl text-brand-green-dark mb-4">Страница не найдена</h1>
      <p className="text-gray-500 text-lg mb-10 max-w-md">
        Возможно, она была перемещена или удалена. Вернитесь на главную.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/" className="btn-primary px-8 py-3">На главную</Link>
        <Link href="/catalog" className="btn-outline px-8 py-3">Каталог</Link>
      </div>
    </div>
  );
}
