"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState, useSyncExternalStore } from "react";
import { useCart } from "@/lib/cart-context";
import { useSettings } from "@/lib/settings-context";

const NARROW_QUERY = "(max-width: 480px)";
function subscribeNarrow(callback: () => void) {
  const mq = window.matchMedia(NARROW_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getNarrowSnapshot() {
  return window.matchMedia(NARROW_QUERY).matches;
}
function getNarrowServerSnapshot() {
  return false;
}

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/#o-nas", label: "О нас" },
  { href: "/catalog", label: "Каталог" },
  { href: "/novinka", label: "Новинки" },
  { href: "/aktsii", label: "Акции" },
  { href: "/delivery", label: "Доставка" },
];

function navClass(active: boolean) {
  const base = "h-11 flex items-center px-5 rounded-full text-base font-medium whitespace-nowrap transition-colors border";
  return active
    ? `${base} bg-sage-500/10 border-sage-500/30 text-sage-700`
    : `${base} border-transparent text-foreground hover:border-border hover:bg-muted`;
}

function mobileNavClass(active: boolean) {
  const base = "px-4 py-3 rounded-xl text-base font-medium text-center transition-colors";
  return active
    ? `${base} bg-sage-500/10 text-sage-700`
    : `${base} bg-neutral-100 text-foreground active:bg-neutral-200`;
}

function HeaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { count, total } = useCart();
  const { settings } = useSettings();
  const isNarrow = useSyncExternalStore(subscribeNarrow, getNarrowSnapshot, getNarrowServerSnapshot);
  const urlSearch = pathname === "/catalog" ? searchParams.get("q") ?? "" : "";
  const [search, setSearch] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearch(urlSearch);
  }
  const [open, setOpen] = useState(false);
  const phoneHref = "tel:" + settings.phone.replace(/[^\d+]/g, "");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = search.trim();
    if (q) window.location.href = "/catalog?q=" + encodeURIComponent(q);
  }

  function clearSearch() {
    setSearch("");
    if (urlSearch) window.location.href = "/catalog";
  }

  return (
    <>
      {/* Top bar: logo + contacts */}
      <div className="bg-card border-b-2 border-dashed border-neutral-400">
        <div className="max-w-[1320px] mx-auto px-6 py-3 flex items-center justify-center xl:justify-between gap-6">
          <Link href="/" className="flex-shrink-0">
            <img src="/images/logo.jpg" alt="Орхидея" className="h-16 w-auto" />
          </Link>

          <div className="hidden xl:flex flex-wrap justify-end items-start gap-x-8 gap-y-3 text-sm text-foreground">
            <div className="flex items-start gap-2 pt-0.5 whitespace-nowrap">
              <svg className="w-5 h-5 text-sage-700 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <rect x={3} y={5} width={18} height={14} rx={2} />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <a href={`mailto:${settings.email}`} className="hover:text-sage-700 transition-colors">{settings.email}</a>
            </div>
            <div className="flex items-start gap-2 pt-0.5 whitespace-nowrap">
              <svg className="w-5 h-5 text-sage-700 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx={12} cy={10} r={3} />
              </svg>
              <span>
                {settings.address.split("\n").map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </span>
            </div>
            <div className="flex items-start gap-2 pt-0.5 whitespace-nowrap">
              <svg className="w-5 h-5 text-sage-700 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
              <div className="flex flex-col items-start">
                <a href={phoneHref} className="font-semibold text-foreground hover:text-sage-700 transition-colors">{settings.phone}</a>
                <span className="text-xs text-muted-foreground">{settings.workingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <header className="sticky top-0 z-50 bg-card shadow-sm">
        <div className="max-w-[1320px] mx-auto px-6 py-3.5 flex items-center gap-6">

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-1 flex-1">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className={navClass(pathname === href || (href !== "/" && pathname.startsWith(href + "/")))}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-xs relative">
            <input
              type="text"
              placeholder={isNarrow ? "Поиск" : "Артикул или название"}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full h-11 bg-muted text-foreground placeholder-muted-foreground rounded-xl px-4 text-sm border border-border focus:outline-none focus:border-sage-500 ${search ? "pr-16" : "pr-10"}`}
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Очистить поиск"
                className="absolute right-9 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <line x1={18} y1={6} x2={6} y2={18} />
                  <line x1={6} y1={6} x2={18} y2={18} />
                </svg>
              </button>
            )}
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx={11} cy={11} r={8} />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Cart */}
            <Link href="/cart" className="relative flex items-center h-11 gap-2.5 px-3 rounded-xl border border-border hover:bg-muted transition-colors">
              <span className="relative">
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <circle cx={9} cy={21} r={1} />
                  <circle cx={20} cy={21} r={1} />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-600 text-white text-[11px] rounded-full flex items-center justify-center font-medium px-1">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline text-sm text-foreground">
                Корзина покупок <strong className="text-red-600">{total.toLocaleString("ru-RU")} ₽</strong>
              </span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="xl:hidden h-11 w-11 flex items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors text-foreground"
              onClick={() => setOpen(v => !v)}
              aria-label="Меню"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {open ? (
                  <>
                    <line x1={18} y1={6} x2={6} y2={18} />
                    <line x1={6} y1={6} x2={18} y2={18} />
                  </>
                ) : (
                  <>
                    <line x1={3} y1={6} x2={21} y2={6} />
                    <line x1={3} y1={12} x2={21} y2={12} />
                    <line x1={3} y1={18} x2={21} y2={18} />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {open && (
          <div className="xl:hidden bg-card border-t border-border px-6 py-4 flex flex-col gap-2">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={mobileNavClass(pathname === href)}
              >
                {label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-border flex flex-col items-center gap-1 text-center">
              <a href={phoneHref} className="text-muted-foreground text-sm">
                {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="text-muted-foreground text-sm">
                {settings.email}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderInner />
    </Suspense>
  );
}
