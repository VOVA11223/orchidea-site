"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useOrders } from "@/lib/orders-context";
import type { Order } from "@/lib/orders-context";

const ORDER_STATUS_LABELS: Record<Order["orderStatus"], string> = {
  new: "Новый",
  confirmed: "Подтверждён",
  shipped: "Отгружен",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

// Ordinal ramp for the fulfillment pipeline (new → delivered), cancelled flagged separately in red.
const ORDER_STATUS_COLORS: Record<Order["orderStatus"], string> = {
  new: "#86b6ef",
  confirmed: "#5598e7",
  shipped: "#2a78d6",
  delivered: "#1c5cab",
  cancelled: "#d03b3b",
};

const MONTH_LABELS = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

function lastMonths(n: number) {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABELS[d.getMonth()] };
  });
}

export default function AdminStatisticsPage() {
  const { orders } = useOrders();

  const months = useMemo(() => lastMonths(6), []);

  const revenueByMonth = useMemo(() => {
    const totals = new Map<string, number>();
    orders.forEach(o => {
      if (o.paymentStatus !== "paid") return;
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      totals.set(key, (totals.get(key) ?? 0) + o.totalPrice);
    });
    return months.map(m => ({ ...m, value: totals.get(m.key) ?? 0 }));
  }, [orders, months]);

  const ordersByStatus = useMemo(() => {
    const counts: Record<Order["orderStatus"], number> = { new: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
    orders.forEach(o => { counts[o.orderStatus]++; });
    return (Object.keys(ORDER_STATUS_LABELS) as Order["orderStatus"][]).map(status => ({
      status,
      label: ORDER_STATUS_LABELS[status],
      color: ORDER_STATUS_COLORS[status],
      count: counts[status],
    }));
  }, [orders]);

  const topProducts = useMemo(() => {
    const totals = new Map<string, { id: string; name: string; qty: number; revenue: number }>();
    orders.forEach(o => {
      o.items.forEach(item => {
        const entry = totals.get(item.id) ?? { id: item.id, name: item.name, qty: 0, revenue: 0 };
        entry.qty += item.quantity;
        entry.revenue += item.price * item.quantity;
        totals.set(item.id, entry);
      });
    });
    return Array.from(totals.values()).sort((a, b) => b.qty - a.qty).slice(0, 6);
  }, [orders]);

  const totalRevenuePaid = orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.totalPrice, 0);
  const avgOrderValue = orders.length > 0 ? orders.reduce((s, o) => s + o.totalPrice, 0) / orders.length : 0;
  const itemsSold = orders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0);

  const maxMonthRevenue = Math.max(1, ...revenueByMonth.map(m => m.value));
  const maxStatusCount = Math.max(1, ...ordersByStatus.map(s => s.count));
  const maxProductQty = Math.max(1, ...topProducts.map(p => p.qty));
  const maxMonthIndex = revenueByMonth.reduce((best, m, i) => (m.value > revenueByMonth[best].value ? i : best), 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="bg-sage-500 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(26,36,32,0.45), rgba(26,36,32,0.45)), url(/images/hero-bg.png)" }}>
        <div className="max-w-[1320px] mx-auto px-6 py-10">
          <div className="text-white/60 text-sm mb-2">
            <Link href="/admin" className="hover:text-white transition-colors">Админ-панель</Link> <span className="mx-1">›</span> Статистика
          </div>
          <h1 className="font-brand text-4xl font-bold text-white">Статистика</h1>
          <p className="text-white/80 mt-1">Аналитика по заказам и товарам</p>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-6 py-14">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 text-center py-20 text-neutral-400">
            <div className="text-4xl mb-4">📊</div>
            <div className="font-medium text-neutral-600">Пока нет данных для статистики</div>
            <div className="text-sm mt-1">Графики появятся после первых заказов</div>
          </div>
        ) : (
          <>
            {/* KPI tiles */}
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 border border-neutral-200">
                <div className="text-sm text-neutral-500 mb-2">Выручка (оплачено)</div>
                <div className="text-3xl font-bold text-primary-900">{totalRevenuePaid.toLocaleString("ru")} ₽</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-neutral-200">
                <div className="text-sm text-neutral-500 mb-2">Заказов всего</div>
                <div className="text-3xl font-bold text-primary-900">{orders.length}</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-neutral-200">
                <div className="text-sm text-neutral-500 mb-2">Средний чек</div>
                <div className="text-3xl font-bold text-primary-900">{Math.round(avgOrderValue).toLocaleString("ru")} ₽</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-neutral-200">
                <div className="text-sm text-neutral-500 mb-2">Товаров продано</div>
                <div className="text-3xl font-bold text-primary-900">{itemsSold.toLocaleString("ru")} шт</div>
              </div>
            </div>

            {/* Revenue by month */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-6">Выручка по месяцам</h2>
              <div className="flex items-end justify-between gap-3 h-44 px-2">
                {revenueByMonth.map((m, i) => {
                  const px = Math.max(4, Math.round((m.value / maxMonthRevenue) * 160));
                  const highlight = i === maxMonthIndex || i === revenueByMonth.length - 1;
                  return (
                    <div key={m.key} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                      <div className={`text-xs tabular-nums ${highlight ? "text-primary-700 font-semibold" : "text-transparent"}`}>
                        {m.value > 0 ? `${Math.round(m.value / 1000)}к` : ""}
                      </div>
                      <div
                        title={`${m.value.toLocaleString("ru")} ₽`}
                        className="w-8 rounded-t bg-primary-500 hover:bg-primary-600 transition-colors"
                        style={{ height: `${px}px` }}
                      />
                      <div className="text-xs text-neutral-400">{m.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Orders by status */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-primary-900 mb-5">Заказы по статусу</h2>
                <div className="space-y-3">
                  {ordersByStatus.map(s => (
                    <div key={s.status} className="flex items-center gap-3">
                      <div className="w-28 flex-shrink-0 text-sm text-neutral-600">{s.label}</div>
                      <div className="flex-1 h-3 bg-neutral-100 rounded-r">
                        <div
                          title={`${s.label}: ${s.count}`}
                          className="h-3 rounded-r transition-all"
                          style={{ width: `${(s.count / maxStatusCount) * 100}%`, backgroundColor: s.color }}
                        />
                      </div>
                      <div className="w-8 flex-shrink-0 text-sm font-semibold text-neutral-900 text-right tabular-nums">{s.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top products */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-primary-900 mb-5">Топ товаров по продажам</h2>
                {topProducts.length === 0 ? (
                  <div className="text-sm text-neutral-400 py-6 text-center">Нет данных</div>
                ) : (
                  <div className="space-y-3">
                    {topProducts.map(p => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-32 flex-shrink-0 text-sm text-neutral-600 truncate" title={p.name}>{p.name}</div>
                        <div className="flex-1 h-3 bg-neutral-100 rounded-r">
                          <div
                            title={`${p.qty} шт · ${p.revenue.toLocaleString("ru")} ₽`}
                            className="h-3 rounded-r bg-primary-500 transition-all"
                            style={{ width: `${(p.qty / maxProductQty) * 100}%` }}
                          />
                        </div>
                        <div className="w-16 flex-shrink-0 text-sm font-semibold text-neutral-900 text-right tabular-nums">{p.qty} шт</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
