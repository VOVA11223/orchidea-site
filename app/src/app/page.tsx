"use client";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCardImage from "@/components/ProductCardImage";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { useCallbackModal } from "@/lib/callback-modal-context";
import { useSettings } from "@/lib/settings-context";

const STEPS = [
  { n: "01", title: "Оставить заявку", desc: "Можно онлайн или по телефону" },
  { n: "02", title: "Оплата", desc: "Возможно безналичный и наличный расчет" },
  { n: "03", title: "Доставка", desc: "Различные способы доставки или самовывоз" },
];

export default function HomePage() {
  const { open: openCallbackModal } = useCallbackModal();
  const { settings } = useSettings();

  // по одному товару на категорию — полный ряд из 6 карточек, как в макете.
  // Берём из общего каталога (lib/products), а не из живого /catalog (там пока
  // только 4 товара-заглушки) — иначе сетка не собиралась бы в 3×2.
  const catalogPreview = CATEGORIES
    .map(c => PRODUCTS.find(p => p.category === c.id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 6);

  const categoryLabels = new Map(CATEGORIES.map(c => [c.id, c.label]));

  return (
    <div>
      {/* Hero */}
      <section className="bg-sage-500 relative overflow-hidden border-t border-dashed border-white/40">
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-[position:15%_center] md:bg-center"
          style={{ backgroundImage: "url(/images/hero-bg.png)" }}
        />

        <div className="max-w-[1320px] mx-auto px-6 pt-16 pb-20 md:pt-28 md:pb-32 relative z-10">
          <div className="max-w-xl mx-auto text-center md:mx-0 md:text-left">
            <h1 className="font-brand text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-navy-900">
              Искусственные<br />цветы оптом
            </h1>
            <p className="text-navy-800 text-xl md:text-2xl font-semibold leading-relaxed mb-6">
              Минимальный заказ от {settings.minOrder.toLocaleString("ru")} руб.
            </p>
            <p className="text-navy-800/80 text-base md:text-lg leading-relaxed mb-10">
              Большой выбор ассортимента цветов и композиционных букетов.
            </p>
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-start">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center h-14 px-8 bg-white hover:bg-neutral-50 transition-colors rounded-full font-semibold text-navy-900 shadow-sm"
              >
                Смотреть каталог
              </Link>
              <div className="flex items-center gap-3">
                <a
                  href={settings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-14 h-14 rounded-full bg-white hover:bg-neutral-50 transition-colors shadow-sm flex items-center justify-center text-navy-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
                <a
                  href={settings.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="w-14 h-14 rounded-full bg-white hover:bg-neutral-50 transition-colors shadow-sm flex items-center justify-center text-navy-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </a>
                <a
                  href={settings.max}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="MAX"
                  className="w-14 h-14 rounded-full bg-white hover:bg-neutral-50 transition-colors shadow-sm flex items-center justify-center text-navy-900 text-xs font-bold tracking-wide"
                >
                  MAX
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Декоративный узор из концентрических дуг за секциями "О нас" и "Каталог товаров", как в макете */}
      <div className="relative overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full text-neutral-900/[0.04] pointer-events-none"
          preserveAspectRatio="xMinYMax slice"
          viewBox="0 0 800 800"
          fill="none"
        >
          {[120, 240, 360, 480, 600, 720, 840].map(r => (
            <circle key={r} cx="0" cy="800" r={r} stroke="currentColor" strokeWidth="1.5" />
          ))}
        </svg>

      {/* О нас */}
      <section id="o-nas" className="max-w-[1320px] mx-auto px-6 py-10 md:py-14 scroll-mt-24 relative">
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 md:p-14">
          <div className="flex justify-center mb-5 md:mb-8">
            <span className="px-4 py-1.5 bg-neutral-100 text-neutral-500 text-xs font-semibold tracking-wide rounded-full">О НАС</span>
          </div>
          <div className="flex flex-col md:flex-row gap-10 md:items-center justify-center">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="font-brand text-3xl md:text-4xl font-bold text-primary-900 mb-3 md:mb-4">Несколько слов о нас</h2>
              <p className="text-neutral-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                Наша компания работает с 2011 года и активно развивается, постоянно расширяя и поддерживая ассортимент товаров.
                Мы рады приветствовать Вас на нашем сайте и надеемся на долгое и взаимовыгодное сотрудничество!
              </p>
              <button
                onClick={openCallbackModal}
                className="inline-block px-7 py-3.5 bg-primary-600 hover:bg-primary-500 transition-colors rounded-full font-semibold text-white"
              >
                Заказать звонок
              </button>
            </div>
            <div className="hidden md:flex md:flex-col gap-4 flex-shrink-0 self-center">
              <div className="w-44 md:w-52 bg-neutral-50 rounded-2xl p-6 text-center">
                <svg className="w-9 h-9 text-gold-500 mx-auto" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <circle cx={12} cy={8} r={5} />
                  <path d="M8.5 12.5 7 21l5-3 5 3-1.5-8.5" />
                </svg>
                <div className="font-semibold text-primary-900 text-base mt-3">Отзывчивость</div>
                <div className="text-neutral-500 text-sm mt-1">Быстрое обслуживание</div>
              </div>
              <div className="w-44 md:w-52 bg-neutral-50 rounded-2xl p-6 text-center">
                <svg className="w-9 h-9 text-gold-500 mx-auto" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M21 8 12 3 3 8l9 5 9-5Z" />
                  <path d="M3 8v8l9 5 9-5V8" />
                  <path d="M12 13v8" />
                </svg>
                <div className="font-semibold text-primary-900 text-base mt-3">Оптовикам</div>
                <div className="text-neutral-500 text-sm mt-1">Доступные цены</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Каталог товаров */}
      <section className="max-w-[1320px] mx-auto px-6 pb-10 md:pb-14 relative">
        <h2 className="font-brand text-3xl md:text-4xl font-bold text-primary-900 text-center mb-6 md:mb-10">Каталог товаров</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-10">
          {catalogPreview.map(p => (
            <div key={p.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col">
              <div className="relative">
                <ProductCardImage img={p.img} category={p.category} className="h-32 md:h-44" />
                <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
                  {p.isNew && <span className="px-2 py-0.5 bg-emerald-400 text-primary-900 text-xs font-bold rounded-full">NEW</span>}
                  {p.isSale && <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">СКИДКА</span>}
                  {!p.inStock && <span className="px-2 py-0.5 bg-neutral-500 text-white text-xs font-bold rounded-full">Нет в наличии</span>}
                </div>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs text-muted-foreground truncate min-w-0">{categoryLabels.get(p.category) ?? p.category}</span>
                  <span className="text-xs text-muted-foreground truncate shrink-0 max-w-[50%]">Арт. {p.article}</span>
                </div>
                <Link href={`/product/${p.id}`} className="text-sm font-medium text-foreground hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                  {p.name}
                </Link>
                <div className="mt-auto pt-1.5">
                  {p.color && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-neutral-300" style={{ backgroundColor: p.color }} />
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-primary-700">{p.price} ₽</span>
                    {p.oldPrice && <span className="text-xs text-muted-foreground line-through">{p.oldPrice} ₽</span>}
                    <span className="text-xs text-muted-foreground">/шт</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">Уп. {p.minQty} шт · {(p.price * p.minQty).toLocaleString("ru")} ₽</div>
                  {p.inStock
                    ? <AddToCartButton id={p.id} name={p.name} article={p.article} price={p.price} image={p.img} minQty={p.minQty} />
                    : <div className="w-full py-2 rounded-xl text-sm text-center text-muted-foreground bg-muted border border-border">Нет в наличии</div>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/catalog" className="inline-block px-7 py-3.5 bg-primary-600 hover:bg-primary-500 transition-colors rounded-full font-semibold text-white">
            Смотреть каталог
          </Link>
        </div>
      </section>
      </div>

      {/* Этапы нашей работы */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-neutral-50"
          style={{ clipPath: "polygon(0 7%, 100% 0, 100% 100%, 0 100%)" }}
        />
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center pointer-events-none mix-blend-multiply"
          style={{
            clipPath: "polygon(0 7%, 100% 0, 100% 100%, 0 100%)",
            backgroundImage: "url(/images/paper-texture.jpg)",
          }}
        />
        <div className="max-w-[1320px] mx-auto px-6 py-10 md:py-16 relative">
          <div className="hidden md:grid md:grid-cols-[1fr_2fr] gap-6 md:gap-10 items-center mb-6 md:mb-10">
            <div className="-rotate-[1.4deg] text-center md:text-left">
              <div className="text-primary-500 text-sm font-medium mb-2">Очень просто и доступно каждому</div>
              <h2 className="font-brand text-3xl md:text-4xl font-bold text-primary-900">Этапы нашей работы</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
              {STEPS.map(s => (
                <div key={s.n} className="border-2 border-dashed border-neutral-500 rounded-2xl p-5 md:p-6 bg-white/55 backdrop-blur-sm text-center md:text-left">
                  <div className="text-primary-500 text-3xl md:text-4xl font-bold mb-2 md:mb-3">{s.n}.</div>
                  <div className="font-semibold text-primary-900 text-base md:text-lg mb-1.5">{s.title}</div>
                  <div className="text-neutral-600 text-sm leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: приглашение приехать на склад вместо этапов работы */}
          <div className="md:hidden mb-6">
            <div className="border-2 border-dashed border-neutral-500 rounded-2xl p-5 bg-white/55 backdrop-blur-sm text-center">
              <div className="font-semibold text-primary-900 text-lg mb-2">
                Наш склад находится по адресу {settings.address.replace("\n", " ")}
              </div>
              <div className="text-neutral-600 text-sm leading-relaxed">
                Вы можете приехать к нам самостоятельно, предварительно связавшись с нами.
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={openCallbackModal}
              className="inline-block px-7 py-3.5 bg-primary-600 hover:bg-primary-500 transition-colors rounded-full font-semibold text-white"
            >
              Оставить заявку
            </button>
          </div>
        </div>
      </section>

      {/* Карта */}
      <section className="relative -mt-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ clipPath: "polygon(0 6%, 100% 0, 100% 100%, 0 100%)" }}
        >
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=44.532207%2C48.764271&z=16&pt=44.532207%2C48.764271%2Cpm2rdm"
            className="absolute inset-0 w-full h-full"
            frameBorder={0}
            title="Орхидея на карте — ул. имени Менделеева, 72, Волгоград"
          />
        </div>
        <div className="relative h-[380px] md:h-[560px] flex items-end justify-center pb-16 md:pb-10 pointer-events-none">
          <a
            href="https://yandex.ru/maps/?text=Волгоград%2C%20улица%20имени%20Менделеева%2C%2072"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-sm text-navy-800 text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            <svg className="w-4 h-4 text-sage-700 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx={12} cy={10} r={3} />
            </svg>
            ул. имени Менделеева, 72, Волгоград
          </a>
        </div>
      </section>

      {/* Переход к футеру */}
      <div className="relative h-20 bg-neutral-50 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply"
          style={{ backgroundImage: "url(/images/paper-texture.jpg)" }}
        />
      </div>
    </div>
  );
}
