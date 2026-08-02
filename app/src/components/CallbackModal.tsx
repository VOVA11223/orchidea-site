"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCallbackModal } from "@/lib/callback-modal-context";
import { formatPhoneDigits, parsePhoneInput } from "@/lib/phone";

export default function CallbackModal() {
  const { isOpen, close } = useCallbackModal();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setName("");
      setPhoneDigits("");
      setConsent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handlePhoneKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      setPhoneDigits(d => d.slice(0, -1));
    }
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhoneDigits(parsePhoneInput(e.target.value, phoneDigits));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/send-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: formatPhoneDigits(phoneDigits) }),
      });
    } catch (error) {
      console.error("Error sending callback request:", error);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={close} />

      <div className="relative bg-white rounded-3xl p-8 md:p-10 w-full max-w-md shadow-xl">
        <button
          onClick={close}
          aria-label="Закрыть"
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <line x1={18} y1={6} x2={6} y2={18} />
            <line x1={6} y1={6} x2={18} y2={18} />
          </svg>
        </button>

        {submitted ? (
          <div className="py-6 text-center">
            <h2 className="font-brand text-2xl font-bold text-primary-900 mb-2">Спасибо!</h2>
            <p className="text-neutral-500">Мы скоро перезвоним Вам сами.</p>
          </div>
        ) : (
          <>
            <h2 className="font-brand text-3xl font-bold text-primary-900 mb-2">Обратный звонок</h2>
            <p className="text-neutral-500 mb-6">Заполните форму, и мы перезвоним Вам сами</p>

            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Ваше имя</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Имя Фамилия"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-400 mb-5"
              />

              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Номер телефона</label>
              <input
                type="tel"
                inputMode="numeric"
                required
                value={formatPhoneDigits(phoneDigits)}
                onKeyDown={handlePhoneKeyDown}
                onChange={handlePhoneChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-400 mb-6"
              />

              <label className="flex items-center gap-2.5 cursor-pointer mb-6">
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
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 disabled:bg-neutral-300 transition-colors rounded-full font-semibold text-white"
              >
                {loading ? "Отправка..." : "Заказать звонок"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
