"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useOrders } from "@/lib/orders-context";
import Link from "next/link";

function OrderSuccessInner() {
  const params = useSearchParams();
  const orderId = params.get("id");
  const { getOrderById } = useOrders();
  const order = orderId ? getOrderById(orderId) : undefined;

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success badge */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-brand text-4xl font-bold text-primary-900 mb-3">Спасибо за заказ!</h1>
          <p className="text-lg text-neutral-600">
            Ваш заказ принят. Менеджер свяжется с вами в ближайшее время для подтверждения.
          </p>
        </div>

        {/* Order details, when available */}
        {order && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-neutral-200">
              <div>
                <div className="text-sm text-neutral-500 mb-1">Номер заказа</div>
                <div className="text-2xl font-bold text-primary-900">{order.id}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500 mb-1">Дата</div>
                <div className="text-2xl font-bold text-primary-900">
                  {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-semibold text-primary-900 mb-4">Данные для доставки</h2>
              <div className="space-y-2 text-sm">
                <div><span className="text-neutral-500">Имя:</span> <span className="font-medium">{order.clientName}</span></div>
                <div><span className="text-neutral-500">Телефон:</span> <span className="font-medium">{order.clientPhone}</span></div>
                <div><span className="text-neutral-500">Адрес:</span> <span className="font-medium">{order.deliveryAddress}</span></div>
                {order.deliveryDateTime && (
                  <div>
                    <span className="text-neutral-500">Желаемое время доставки:</span>{" "}
                    <span className="font-medium">{new Date(order.deliveryDateTime).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                )}
                {order.notes && <div><span className="text-neutral-500">Комментарий:</span> <span className="font-medium">{order.notes}</span></div>}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-semibold text-primary-900 mb-4">Товары</h2>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-neutral-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900">{item.name}</div>
                      <div className="text-xs text-neutral-500">x{item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{(item.price * item.quantity).toLocaleString("ru")} ₽</div>
                      <div className="text-xs text-neutral-500">{item.price} ₽/шт</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-neutral-900">Сумма к оплате:</span>
              <span className="text-3xl font-bold text-primary-600">
                {order.totalPrice.toLocaleString("ru")} ₽
              </span>
            </div>
          </div>
        )}

        {/* Info boxes */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="font-semibold text-blue-900 mb-1">📞 Что дальше?</div>
            <div className="text-sm text-blue-800">
              Менеджер позвонит вам для подтверждения заказа и уточнения деталей доставки.
            </div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <div className="font-semibold text-emerald-900 mb-1">✓ Спасибо!</div>
            <div className="text-sm text-emerald-800">
              Мы ценим ваш выбор и постараемся сделать доставку максимально удобной.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link href="/catalog" className="px-7 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-500 transition-colors">
            Продолжить покупки
          </Link>
          <Link href="/" className="px-7 py-3 bg-neutral-200 text-neutral-900 rounded-xl font-medium hover:bg-neutral-300 transition-colors">
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessInner />
    </Suspense>
  );
}
