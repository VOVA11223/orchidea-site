"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useSettings } from "@/lib/settings-context";
import Link from "next/link";

function CartQtyInput({ id, qty, minQty }: { id: string; qty: number; minQty: number }) {
  const { update } = useCart();
  const [value, setValue] = useState(String(qty));

  useEffect(() => {
    setValue(String(qty));
  }, [qty]);

  function commit(raw: string) {
    const n = parseInt(raw, 10);
    update(id, Number.isNaN(n) ? 0 : n);
  }

  return (
    <input
      type="number"
      min={minQty}
      step={minQty}
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={e => commit(e.target.value)}
      onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
      className="w-12 py-1.5 text-center text-sm font-semibold border-x border-neutral-200 focus:outline-none bg-transparent"
    />
  );
}

export default function CartPage() {
  const { items, remove, update, total, clear } = useCart();
  const { settings } = useSettings();
  const MIN_ORDER = settings.minOrder;

  const progress = Math.min((total / MIN_ORDER) * 100, 100);
  const remaining = Math.max(MIN_ORDER - total, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-[1320px] mx-auto px-6 py-24 flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-neutral-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1={3} y1={6} x2={21} y2={6} />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <div>
          <h1 className="font-brand text-2xl font-bold text-primary-900 mb-2">Корзина пуста</h1>
          <p className="text-neutral-500">Добавьте товары из каталога</p>
        </div>
        <Link href="/catalog" className="px-7 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-500 transition-colors">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-brand text-2xl font-bold text-primary-900">Корзина</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{items.length} позиций</p>
        </div>
        <button onClick={clear} className="px-4 py-2 border border-red-200 rounded-full text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
          Очистить корзину
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-neutral-200 p-4">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-xl bg-neutral-100 bg-cover bg-center flex-shrink-0"
                  style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-neutral-900 text-sm leading-snug">{item.name}</p>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-neutral-300 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => update(item.id, item.qty - item.minQty)}
                        className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 text-sm font-bold"
                      >−</button>
                      <CartQtyInput id={item.id} qty={item.qty} minQty={item.minQty} />
                      <button
                        onClick={() => update(item.id, item.qty + item.minQty)}
                        className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 text-sm font-bold"
                      >+</button>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary-700">{(item.price * item.qty).toLocaleString("ru")} ₽</div>
                      <div className="text-xs text-neutral-400">{item.price} ₽/шт</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Min order progress */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-neutral-700">Минимальный заказ</span>
              <span className={remaining === 0 ? "text-emerald-600 font-semibold" : "text-neutral-500"}>
                {remaining === 0 ? "✓ Выполнен" : `ещё ${remaining.toLocaleString("ru")} ₽`}
              </span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 mb-1">
              <div
                className={`h-2 rounded-full transition-all ${remaining === 0 ? "bg-emerald-500" : "bg-primary-400"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-neutral-400">{total.toLocaleString("ru")} / {MIN_ORDER.toLocaleString("ru")} ₽</div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <h3 className="font-semibold text-neutral-900 mb-4">Итого</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-neutral-600">Товары ({items.length} поз.)</span>
                <span className="font-medium">{total.toLocaleString("ru")} ₽</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Доставка</span>
                <span>по тарифу</span>
              </div>
            </div>
            <div className="border-t border-neutral-100 pt-4 flex justify-between font-bold text-base mb-5">
              <span>К оплате</span>
              <span className="text-primary-700">{total.toLocaleString("ru")} ₽</span>
            </div>
            <Link
              href={remaining === 0 ? "/checkout" : "#"}
              className={`block text-center w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                remaining === 0
                  ? "bg-primary-600 hover:bg-primary-500 text-white"
                  : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              }`}
            >
              Оформить заказ
            </Link>
            {remaining > 0 && (
              <p className="text-xs text-neutral-400 text-center mt-2">
                Добавьте ещё на {remaining.toLocaleString("ru")} ₽ для оформления
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
