"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSettings } from "@/lib/settings-context";
import type { Settings } from "@/lib/settings-context";

const inputClass = "w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-400";
const labelClass = "block text-sm font-medium text-neutral-600 mb-1";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "minOrder" ? Number(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="bg-sage-500 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(26,36,32,0.45), rgba(26,36,32,0.45)), url(/images/hero-bg.png)" }}>
        <div className="max-w-[1320px] mx-auto px-6 py-10">
          <div className="text-white/60 text-sm mb-2">
            <Link href="/admin" className="hover:text-white transition-colors">Админ-панель</Link> <span className="mx-1">›</span> Настройки
          </div>
          <h1 className="font-brand text-4xl font-bold text-white">Настройки</h1>
          <p className="text-white/80 mt-1">Конфигурация магазина</p>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-6 py-14">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
          {/* Order settings */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-200 space-y-4 h-fit">
            <h2 className="text-xl font-semibold text-primary-900 mb-2">Заказы</h2>
            <div>
              <label className={labelClass}>Минимальная сумма заказа, ₽</label>
              <input
                type="number"
                name="minOrder"
                min={0}
                step={100}
                value={form.minOrder}
                onChange={handleChange}
                className={inputClass}
                required
              />
              <p className="text-xs text-neutral-400 mt-1">Используется в корзине и на главной странице.</p>
            </div>
          </div>

          {/* Contacts */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-200 space-y-4 h-fit">
            <h2 className="text-xl font-semibold text-primary-900 mb-2">Контакты</h2>
            <div>
              <label className={labelClass}>Телефон</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+7 903 374-31-37" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="orchidea_opt@mail.ru" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Адрес</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={2} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Часы работы</label>
              <input type="text" name="workingHours" value={form.workingHours} onChange={handleChange} placeholder="Ежедневно с 8:00 до 17:00" className={inputClass} required />
            </div>
          </div>

          {/* Social links */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-200 space-y-4 h-fit lg:col-span-2">
            <h2 className="text-xl font-semibold text-primary-900 mb-2">Мессенджеры и соцсети</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>WhatsApp</label>
                <input type="url" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="https://wa.me/..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Telegram</label>
                <input type="url" name="telegram" value={form.telegram} onChange={handleChange} placeholder="https://t.me/..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>MAX</label>
                <input type="url" name="max" value={form.max} onChange={handleChange} placeholder="https://max.ru/..." className={inputClass} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 transition-colors rounded-full text-white font-medium"
            >
              Сохранить изменения
            </button>
            {saved && <span className="text-sm text-emerald-600 font-medium">Сохранено</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
