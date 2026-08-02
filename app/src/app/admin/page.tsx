"use client";
import Link from "next/link";
import { useProducts } from "@/lib/products-context";
import { useOrders } from "@/lib/orders-context";

async function handleLogout() {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "/admin/login";
}

export default function AdminPage() {
  const { products } = useProducts();
  const { orders } = useOrders();

  const activeOrders = orders.filter(o => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled").length;
  const newProducts = products.filter(p => p.isNew).length;
  const now = new Date();
  const revenueThisMonth = orders
    .filter(o => {
      const d = new Date(o.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && o.paymentStatus === "paid";
    })
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const modules = [
    { icon: "📦", title: "Товары", desc: "Управление каталогом и товарами", href: "/admin/products" },
    { icon: "🗂️", title: "Категории", desc: "Категории и подкатегории каталога", href: "/admin/categories" },
    { icon: "📋", title: "Заказы", desc: "Просмотр и управление заказами", href: "/admin/orders" },
    { icon: "⚙️", title: "Настройки", desc: "Конфигурация магазина", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="bg-sage-500 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(26,36,32,0.45), rgba(26,36,32,0.45)), url(/images/hero-bg.png)" }}>
        <div className="max-w-[1320px] mx-auto px-6 py-10">
          <div className="text-white/60 text-sm mb-2">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link> <span className="mx-1">›</span> Админ-панель
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-brand text-4xl font-bold text-white">Админ-панель</h1>
              <p className="text-white/80 mt-1">Управление магазином</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 transition-colors rounded-xl text-white text-sm font-medium flex-shrink-0"
            >
              Выйти
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-6 py-14">
        {/* Admin grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(m => (
            <Link
              key={m.href}
              href={m.href}
              className="bg-white rounded-2xl p-8 border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200 block"
            >
              <div className="text-3xl mb-3">{m.icon}</div>
              <h2 className="text-xl font-semibold text-primary-900 mb-2">{m.title}</h2>
              <p className="text-neutral-500 text-sm mb-4">{m.desc}</p>
              <div className="px-4 py-2 bg-primary-600 hover:bg-primary-500 transition-colors rounded-full text-white text-sm font-medium inline-block">
                Открыть
              </div>
            </Link>
          ))}
        </div>

        {/* Quick stats */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="text-sm text-neutral-500 mb-2">Активные заказы</div>
            <div className="text-3xl font-bold text-primary-900">{activeOrders}</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="text-sm text-neutral-500 mb-2">Товаров в каталоге</div>
            <div className="text-3xl font-bold text-primary-900">{products.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="text-sm text-neutral-500 mb-2">Новинок в каталоге</div>
            <div className="text-3xl font-bold text-primary-900">{newProducts}</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-neutral-200">
            <div className="text-sm text-neutral-500 mb-2">Выручка (месяц)</div>
            <div className="text-3xl font-bold text-primary-900">{revenueThisMonth.toLocaleString("ru")} ₽</div>
          </div>
        </div>
      </div>
    </div>
  );
}
