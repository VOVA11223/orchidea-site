"use client";
import Link from "next/link";
import { useSettings } from "@/lib/settings-context";

export default function Footer() {
  const { settings } = useSettings();
  const phoneHref = "tel:" + settings.phone.replace(/[^\d+]/g, "");

  return (
    <footer className="bg-sage-500 bg-cover bg-center text-white/80 pt-14 pb-8 mt-16 relative overflow-hidden" style={{ backgroundImage: "linear-gradient(rgba(26,36,32,0.45), rgba(26,36,32,0.45)), url(/images/hero-bg.png)" }}>
      <div className="max-w-[1320px] mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
          <div className="max-w-md">
            <img src="/images/footer-logo.png" alt="Орхидея" className="h-10 w-auto mb-4" />
            <p className="text-sm leading-relaxed text-white/70">
              Оптовый поставщик искусственных цветов и флористических материалов.
              Работаем в Волгограде, доставляем по Волгоградской области.
            </p>
          </div>

          <div className="space-y-1 text-sm text-white md:text-right flex-shrink-0">
            <div>
              <a href={phoneHref} className="font-semibold hover:text-white/70 transition-colors">
                {settings.phone}
              </a>
            </div>
            <div>
              <a href={`mailto:${settings.email}`} className="hover:text-white/70 transition-colors">
                {settings.email}
              </a>
            </div>
            <div className="flex items-center gap-2 pt-2 md:justify-end">
              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/15 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
              <a
                href={settings.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/15 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </a>
              <a
                href={settings.max}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MAX"
                className="h-9 px-2.5 rounded-full border border-white/20 flex items-center justify-center text-[11px] font-bold tracking-wide hover:bg-white/15 transition-colors"
              >
                MAX
              </a>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-white/40 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/60">
          <span>© 2011 Орхидея. Все права защищены. Волгоград.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Условия работы</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
