"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/lib/products-context";
import { useCategories } from "@/lib/categories-context";
import AddToCartButton from "@/components/AddToCartButton";
import ProductQty from "@/components/ProductQty";
import ProductCardImage from "@/components/ProductCardImage";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { products, isLoaded } = useProducts();
  const { categories } = useCategories();

  const categoryLabels = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(c => {
      map.set(c.id, c.label);
      c.subcategories.forEach(sc => map.set(sc.id, sc.label));
    });
    return map;
  }, [categories]);

  const product = products.find(p => p.id === id);

  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => { setActiveImage(0); }, [id]);
  const images = product && product.images.length > 0 ? product.images : product ? [product.img] : [];

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const SWIPE_THRESHOLD = 40;

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (images.length < 2) {
      setTouchStartX(null);
      return;
    }
    if (deltaX > SWIPE_THRESHOLD) {
      setActiveImage(i => (i - 1 + images.length) % images.length);
    } else if (deltaX < -SWIPE_THRESHOLD) {
      setActiveImage(i => (i + 1) % images.length);
    }
    setTouchStartX(null);
  }

  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowLeft") setActiveImage(i => (i - 1 + images.length) % images.length);
      else if (e.key === "ArrowRight") setActiveImage(i => (i + 1) % images.length);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, images.length]);

  const related = product
    ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  if (!product) {
    if (!isLoaded) return null;
    return (
      <div className="max-w-[1320px] mx-auto px-6 py-24 text-center">
        <div className="text-4xl mb-4">🌸</div>
        <div className="font-medium text-foreground mb-5">Товар не найден</div>
        <Link href="/catalog" className="inline-block px-7 py-3.5 bg-primary-600 hover:bg-primary-500 transition-colors rounded-full font-semibold text-white">Вернуться в каталог</Link>
      </div>
    );
  }

  const oldPrice = Number(product.oldPrice) || null;

  return (
    <div>
      {/* Hero */}
      <section className="bg-sage-500 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(26,36,32,0.45), rgba(26,36,32,0.45)), url(/images/hero-bg.png)" }}>
        <div className="max-w-[1320px] mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>›</span>
            <Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link>
            <span>›</span>
            <Link href={`/catalog?cat=${product.category}`} className="hover:text-white transition-colors">
              {categoryLabels.get(product.category) ?? product.category}
            </Link>
            <span>›</span>
            <span className="text-white truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-6 py-10">
      <button
        type="button"
        aria-label="Назад"
        onClick={() => (window.history.length > 1 ? router.back() : router.push("/catalog"))}
        className="mb-4 w-10 h-10 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-neutral-900 shadow-sm transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="min-w-0 space-y-3">
          <div
            className="relative group touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              aria-label="Открыть фото на весь экран"
              onClick={() => setLightboxOpen(true)}
              className="w-full h-[480px] md:h-[640px] rounded-2xl bg-white bg-contain bg-center bg-no-repeat cursor-zoom-in"
              style={{ backgroundImage: `url(${images[activeImage] ?? product.img})` }}
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Предыдущее фото"
                  onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Следующее фото"
                  onClick={() => setActiveImage(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                aria-label={`Фото ${i + 1}`}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 rounded-xl bg-white bg-contain bg-center bg-no-repeat cursor-pointer transition-all ${i === activeImage ? "ring-2 ring-primary-400" : "ring-2 ring-transparent hover:ring-neutral-300"}`}
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-neutral-100 text-neutral-500 text-sm font-medium rounded-full">Артикул {product.article}</span>
            {product.isNew && (
              <span className="px-2.5 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">НОВИНКА</span>
            )}
            {product.isSale && (
              <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">СКИДКА</span>
            )}
          </div>

          <h1 className="font-brand text-2xl md:text-3xl font-bold text-primary-900 mb-4 leading-tight">{product.name}</h1>

          <div className="text-xl text-neutral-400 mb-1">
            {product.inStock ? "Наличие: в наличии" : "Наличие: нет"}
          </div>
          <div className="text-neutral-500 mb-5">Высота - {product.height} см</div>

          {/* Price block */}
          <div className="bg-primary-50 rounded-2xl p-6 mb-5">
            <div className="text-center mb-1">
              <span className="text-3xl font-bold text-primary-700">{product.price} ₽</span>
              {oldPrice && (
                <span className="text-xl text-neutral-400 line-through ml-2">{oldPrice} ₽</span>
              )}
              <span className="text-lg text-neutral-500 ml-1">/шт</span>
            </div>
            <div className="text-base text-neutral-600 text-center">
              Упаковка {product.minQty} шт · {(product.price * product.minQty).toLocaleString("ru")} ₽
            </div>
            {product.isSale && oldPrice && (
              <div className="mt-2 text-sm text-red-600 font-medium text-center">
                Экономия {oldPrice - product.price} ₽/шт · {((oldPrice - product.price) * product.minQty).toLocaleString("ru")} ₽/уп
              </div>
            )}

            <div className="border-t border-primary-100 mt-4 pt-4">
              {product.inStock
                ? <ProductQty id={product.id} name={product.name} article={product.article} price={product.price} image={product.img} minQty={product.minQty} />
                : (
                  <div className="w-full py-3.5 rounded-xl text-center text-neutral-400 bg-white border border-neutral-200 text-sm">
                    Нет в наличии — уточните у менеджера
                  </div>
                )
              }
            </div>
          </div>

          {/* Specs */}
          <div>
            <h3 className="font-semibold text-neutral-900 text-lg md:text-base mb-4 md:mb-3">Характеристики</h3>
            <div className="divide-y divide-neutral-100">
              {[
                ["Артикул", product.article],
                ...(product.code ? [["Код", product.code]] : []),
                ["Категория", categoryLabels.get(product.category) ?? product.category],
                ["Мин. упаковка", `${product.minQty} шт`],
                ...(product.budCount ? [["Количество голов", `${product.budCount} шт`]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex py-3.5 md:py-2.5 text-base md:text-sm">
                  <span className="w-36 md:w-40 text-neutral-500 flex-shrink-0">{k}</span>
                  <span className="text-neutral-900 font-medium">{v}</span>
                </div>
              ))}
              {product.colors.length > 0 && (
                <div className="flex items-center py-3.5 md:py-2.5 text-base md:text-sm">
                  <span className="w-36 md:w-40 text-neutral-500 flex-shrink-0">Цвета в упаковке</span>
                  <span className="flex items-center gap-1.5">
                    {product.colors.map((hex, i) => (
                      <span
                        key={i}
                        className="w-5 h-5 md:w-4 md:h-4 rounded-full border-2 border-neutral-300"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="font-brand text-2xl font-bold text-primary-900 mb-6">Похожие товары</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col">
                <Link href={`/product/${p.id}`} className="block">
                  <ProductCardImage images={p.images} className="h-40" />
                </Link>
                <div className="p-3 flex flex-col flex-1">
                  <Link href={`/product/${p.id}`} className="text-sm font-medium text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2 leading-snug">{p.name}</Link>
                  <div className="mt-auto pt-2">
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="font-bold text-primary-700">{p.price} ₽</span>
                      <span className="text-xs text-neutral-400">/шт</span>
                    </div>
                    <AddToCartButton id={p.id} name={p.name} article={p.article} price={p.price} image={p.img} minQty={p.minQty} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            aria-label="Закрыть"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div
            className="w-full h-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${images[activeImage] ?? product.img})` }}
            onClick={e => e.stopPropagation()}
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Предыдущее фото"
                onClick={e => { e.stopPropagation(); setActiveImage(i => (i - 1 + images.length) % images.length); }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Следующее фото"
                onClick={e => { e.stopPropagation(); setActiveImage(i => (i + 1) % images.length); }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {activeImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
