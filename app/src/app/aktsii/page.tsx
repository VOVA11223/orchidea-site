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
                <span className="text-white/60 text-sm">{saleProducts.length} товаров по акции</span>
              </div>
              <h1 className="font-brand text-4xl font-bold text-white mb-2">Специальные предложения</h1>
              <p className="text-white/80">Скидки для оптовых клиентов · Объёмные бонусы</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-6 py-10">

        {/* Sale products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="font-brand text-2xl font-bold text-primary-900">Товары по акции</h2>
              <span className="px-2.5 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">{saleProducts.length} позиций</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
            {saleProducts.map(p => (
              <div key={p.id} className="grid grid-rows-subgrid row-span-4 bg-card rounded-2xl border border-border overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                <div className="relative">
                  <ProductCardImage images={p.images} className="aspect-square" />
                  <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                      −{Math.round((1 - p.price / Number(p.oldPrice)) * 100)}%
                    </span>
                    {!p.inStock && <span className="px-2 py-0.5 bg-neutral-500 text-white text-xs font-bold rounded-full">Нет в наличии</span>}
                  </div>
                </div>
                <div className="px-3 pt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground truncate min-w-0">{categoryLabels.get(p.category) ?? p.category}</span>
                  <span className="text-xs text-muted-foreground truncate shrink-0 max-w-[50%]">Арт. {p.article}</span>
                </div>
                <Link href={`/product/${p.id}`} className="px-3 pt-1 text-sm font-medium text-foreground hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                  {p.name}
                </Link>
                <div className="px-3 pb-3 pt-1.5 flex flex-col">
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <div className={p.budCount ? undefined : "invisible"}>Голов: {p.budCount || 0} шт</div>
                    <div className={p.height ? undefined : "invisible"}>Высота: {p.height || 0} см</div>
                    <div>Уп.{" "}{p.minQty} шт · {(p.price * p.minQty).toLocaleString("ru")}{" "}₽</div>
                  </div>
                  <div className="h-3.5 mt-1 flex items-center gap-1">
                    {p.colors.map((hex, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border-2 border-neutral-300"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                  <div className="flex items-baseline gap-2 mb-3 mt-auto pt-1.5">
                    <span className="text-base font-bold text-primary-700">{p.price}{" ₽"}</span>
                    <span className="text-xs text-muted-foreground line-through">{p.oldPrice}{" ₽"}</span>
                    <span className="text-xs text-muted-foreground">/шт</span>
                  </div>
                  {p.inStock
                    ? <AddToCartButton id={p.id} name={p.name} article={p.article} price={p.price} image={p.img} minQty={p.minQty} />
                    : <div className="w-full py-2 rounded-xl text-sm text-center text-muted-foreground bg-muted border border-border">Нет в наличии</div>
                  }
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
