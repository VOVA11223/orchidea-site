"use client";
import Link from "next/link";
import { useOrders } from "@/lib/orders-context";
import type { Order } from "@/lib/orders-context";

const ORDER_STATUS_LABELS: Record<Order["orderStatus"], string> = {
  new: "Новый",
  confirmed: "Подтверждён",
  shipped: "Отгружен",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

const PAYMENT_STATUS_LABELS: Record<Order["paymentStatus"], string> = {
  pending: "Ожидает оплаты",
  paid: "Оплачен",
  cancelled: "Отменена",
};

export default function AdminOrdersPage() {
  const { orders, updateOrder, deleteOrder } = useOrders();

  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="bg-sage-500 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(26,36,32,0.45), rgba(26,36,32,0.45)), url(/images/hero-bg.png)" }}>
        <div className="max-w-[1320px] mx-auto px-6 py-10">
          <div className="text-white/60 text-sm mb-2">
            <Link href="/admin" className="hover:text-white transition-colors">Админ-панель</Link> <span className="mx-1">›</span> Заказы
          </div>
          <h1 className="font-brand text-4xl font-bold text-white">Заказы</h1>
          <p className="text-white/80 mt-1">Просмотр и управление заказами</p>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-6 py-14">
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-50 px-8 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-primary-900">Все заказы ({orders.length})</h2>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">
              <div className="text-4xl mb-4">📋</div>
              <div className="font-medium text-neutral-600">Заказов пока нет</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Дата</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Клиент</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Сумма</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Оплата</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Статус</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {sorted.map(order => (
                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors align-middle">
                      <td className="px-6 py-3 text-sm text-neutral-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" })}
                        <div className="text-xs text-neutral-400">
                          {new Date(order.createdAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-neutral-900">
                        <div className="font-medium">{order.clientName || "—"}</div>
                        <div className="text-xs text-neutral-500">{order.clientPhone}</div>
                        {order.clientCompany && <div className="text-xs text-neutral-400">{order.clientCompany}</div>}
                      </td>
                      <td className="px-6 py-3 text-sm text-primary-700 font-semibold whitespace-nowrap">
                        {order.totalPrice.toLocaleString("ru")} ₽
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <select
                          value={order.paymentStatus}
                          onChange={e => updateOrder(order.id, { paymentStatus: e.target.value as Order["paymentStatus"] })}
                          className={`border rounded-lg px-2 py-1 text-xs font-medium focus:outline-none ${
                            order.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : order.paymentStatus === "cancelled" ? "bg-neutral-200 text-neutral-500 border-neutral-200"
                            : "bg-amber-100 text-amber-700 border-amber-200"
                          }`}
                        >
                          {(Object.keys(PAYMENT_STATUS_LABELS) as Order["paymentStatus"][]).map(s => (
                            <option key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <select
                          value={order.orderStatus}
                          onChange={e => {
                            const orderStatus = e.target.value as Order["orderStatus"];
                            updateOrder(order.id, orderStatus === "delivered" ? { orderStatus, paymentStatus: "paid" } : { orderStatus });
                          }}
                          className="border border-neutral-200 rounded-lg px-2 py-1 text-sm text-neutral-700 focus:outline-none focus:border-primary-400 bg-white"
                        >
                          {(Object.keys(ORDER_STATUS_LABELS) as Order["orderStatus"][]).map(s => (
                            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-3 text-sm text-right">
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 transition-colors rounded text-red-600 text-xs font-medium"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
