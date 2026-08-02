"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useOrders } from "@/lib/orders-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPhoneDigits, parsePhoneInput } from "@/lib/phone";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { addOrder } = useOrders();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    deliveryAddress: "",
    deliveryDateTime: "",
    notes: "",
  });
  const [phoneDigits, setPhoneDigits] = useState("");
  const [consent, setConsent] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-[1320px] mx-auto px-6 py-24 flex flex-col items-center text-center gap-6">
        <h1 className="font-brand text-2xl font-bold text-primary-900">Корзина пуста</h1>
        <Link href="/catalog" className="px-7 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-500 transition-colors">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setPhoneDigits(d => d.slice(0, -1));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneDigits(parsePhoneInput(e.target.value, phoneDigits));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.clientName,
          clientPhone: formatPhoneDigits(phoneDigits),
          deliveryAddress: formData.deliveryAddress,
          deliveryDateTime: formData.deliveryDateTime,
          notes: formData.notes,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            article: item.article,
            price: item.price,
            qty: item.qty,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Checkout request failed");
      }

      addOrder(data.order);
      clear();
      router.push(`/order-success?id=${data.order.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Ошибка при оформлении заказа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-12">
      <h1 className="font-brand text-3xl font-bold text-primary-900 mb-10">Оформление заказа</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="font-semibold text-lg text-primary-900 mb-6">Данные для доставки</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Имя получателя *</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Иван Петров"
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Номер телефона *</label>
                  <input
                    type="tel"
                    name="clientPhone"
                    inputMode="numeric"
                    value={formatPhoneDigits(phoneDigits)}
                    onKeyDown={handlePhoneKeyDown}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Адрес доставки *</label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder="ул. Ленина, 15, кв. 10"
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Желаемая дата и время доставки</label>
                  <input
                    type="datetime-local"
                    name="deliveryDateTime"
                    value={formData.deliveryDateTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Комментарий к заказу</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Особые пожелания или инструкции..."
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="w-4 h-4 accent-primary-600 flex-shrink-0"
              />
              <span className="text-xs text-neutral-500">
                Я соглашаюсь с{" "}
                <Link href="/privacy" target="_blank" className="text-primary-600 underline hover:text-primary-500 transition-colors">
                  политикой обработки персональных данных
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || phoneDigits.length < 10 || !consent}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-neutral-300 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? "Оформление..." : "Подтвердить заказ"}
            </button>
          </form>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-6">
            <h2 className="font-semibold text-lg text-primary-900 mb-6">Ваш заказ</h2>

            <div className="space-y-2 mb-4 pb-4 border-b border-neutral-200">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-neutral-600">{item.name.substring(0, 25)}... x{item.qty}</span>
                  <span className="font-medium">{(item.price * item.qty).toLocaleString("ru")} ₽</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Товары</span>
                <span className="font-medium">{total.toLocaleString("ru")} ₽</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4 flex justify-between text-lg font-bold">
              <span>Итого</span>
              <span className="text-primary-600">{total.toLocaleString("ru")} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
