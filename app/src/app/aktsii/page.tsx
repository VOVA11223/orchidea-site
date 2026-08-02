"use client";
import { useMemo } from "react";
import { useProducts } from "@/lib/products-context";
import { useCategories } from "@/lib/categories-context";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCardImage from "@/components/ProductCardImage";
import Link from "next/link";

export default function AktsiiPage() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const saleProducts = products.filter(p => p.isSale && p.oldPrice);

  const categoryLabels = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(c => {
      map.set(c.id, c.label);
      c.subcategories.forEach(sc => map.set(sc.id, sc.label));
    });
    return map;
  }, [categories]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-sage-500 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: "linear-gradient(rgba(26,36,32,0.45), rgba(26,36,32,0.45)), url(/images/hero-bg.png)" }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/20 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-[1320px] mx-auto px-6 py-12 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">Акции</span>
                <span className="text-white/60 text-sm">3 активных предложения</span>
              </div>
              <h1 className="font-brand text-4xl font-bold text-white mb-2">Специальные предложения</h1>
              <p className="text-white/80">Скидки для оптовых клиентов · Объёмные бонусы</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-6 py-10">

        {/* Promo cards */}
        <section className="mb-12">
          <h2 className="font-brand text-2xl font-bold text-primary-900 mb-6">Активные акции</h2>
          <div className="grid md:grid-cols-2 gap-6">

            {/* Promo 1 */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-8 -translate-x-8" />
              <div className="relative flex flex-col flex-1">
                <div className="text-6xl font-extrabold mb-2 tracking-tight">−15%</div>
                <div className="font-bold text-2xl mb-2">На заказ от 30 000 ₽</div>
                <p className="text-primary-100 text-base leading-relaxed mb-6 flex-1">Скидка применяется автоматически при оформлении заказа</p>
                <Link href="/catalog" className="block text-center px-5 py-3.5 bg-white text-primary-700 text-base font-bold rounded-xl hover:bg-primary-50 transition-colors shadow-sm">
                  В каталог
                </Link>
              </div>
            </div>

            {/* Promo 2 */}
            <div className="bg-white rounded-2xl p-8 border-2 border-amber-300 relative flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
              <span className="absolute top-4 right-4 px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">Хит</span>
              <div className="text-3xl font-bold text-neutral-900 mb-2">Накопительная скидка</div>
              <p className="text-neutral-500 text-base leading-relaxed mb-6">Чем больше заказываете — тем ниже цена</p>
              <div className="space-y-3 mb-6 flex-1">
                {[["от 50 шт", "−5%"], ["от 100 шт", "−10%"], ["от 200 шт", "−15%"]].map(([q, d]) => (
                  <div key={q} className="flex justify-between items-center text-base border-b border-dashed border-neutral-200 pb-2 last:border-0 last:pb-0">
                    <span className="text-neutral-600">{q}</span>
                    <span className="font-extrabold text-primary-700 text-xl">{d}</span>
                  </div>
                ))}
              </div>
              <Link href="/catalog" className="block text-center px-5 py-3.5 bg-primary-600 text-white text-base font-bold rounded-xl hover:bg-primary-500 transition-colors shadow-sm">
                Воспользоваться
              </Link>
            </div>
          </div>
        </section>

        {/* Sale products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="font-brand text-2xl font-bold text-primary-900">Товары по акции</h2>
              <span className="px-2.5 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">{saleProducts.length} позиций</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {saleProducts.map(p => (
              <div key={p.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col">
                <div className="relative">
                  <ProductCardImage img={p.img} category={p.category} className="h-44" />
                  <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                      −{Math.round((1 - p.price / Number(p.oldPrice)) * 100)}%
                    </span>
                    {!p.inStock && <span className="px-2 py-0.5 bg-neutral-500 text-white text-xs font-bold rounded-full">Нет в наличии</span>}
                  </div>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{categoryLabels.get(p.category) ?? p.category}</span>
                    <span className="text-xs text-muted-foreground">Арт. {p.article}</span>
                  </div>
                  <Link href={`/product/${p.id}`} className="text-sm font-medium text-foreground hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                    {p.name}
                  </Link>
                  <div className="mt-auto pt-1.5">
                    {p.colors.length > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        {p.colors.map((hex, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border-2 border-neutral-300"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-primary-700">{p.price} ₽</span>
                      <span className="text-xs text-muted-foreground line-through">{p.oldPrice} ₽</span>
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
        </section>
      </div>
    </div>
  );
}
