"use client";
import { useMemo } from "react";
import { useProducts, Product } from "@/lib/products-context";
import { useCategories } from "@/lib/categories-context";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCardImage from "@/components/ProductCardImage";
import Link from "next/link";

function ProductCard({ p, categoryLabels }: { p: Product; categoryLabels: Map<string, string> }) {
  return (
    <div className="grid grid-rows-subgrid row-span-4 bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className="relative">
        <ProductCardImage images={p.images} className="aspect-square" />
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          {p.isNew && <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">НОВИНКА</span>}
          {p.isSale && <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">СКИДКА</span>}
          {!p.inStock && <span className="px-2 py-0.5 bg-neutral-500 text-white text-xs font-bold rounded-full">Нет в наличии</span>}
        </div>
      </div>
      <div className="px-3 pt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-neutral-400 truncate min-w-0">{categoryLabels.get(p.category) ?? p.category}</span>
        <span className="text-xs text-neutral-400 truncate shrink-0 max-w-[50%]">Арт. {p.article}</span>
      </div>
      <Link href={`/product/${p.id}`} className="px-3 pt-1 text-sm font-medium text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
        {p.name}
      </Link>
      <div className="px-3 pb-3 pt-1.5 flex flex-col">
        <div className="text-xs text-neutral-400 space-y-0.5">
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
          {p.oldPrice && <span className="text-xs text-neutral-400 line-through">{p.oldPrice}{" ₽"}</span>}
          <span className="text-xs text-neutral-400">/шт</span>
        </div>
        {p.inStock
          ? <AddToCartButton id={p.id} name={p.name} article={p.article} price={p.price} image={p.img} minQty={p.minQty} />
          : <div className="w-full py-2 rounded-xl text-sm text-center text-neutral-400 bg-neutral-50 border border-neutral-200">Нет в наличии</div>
        }
      </div>
    </div>
  );
}

export default function NovinkaPage() {
  const { products } = useProducts();
  const { categories } = useCategories();

  const categoryLabels = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(c => {
      map.set(c.id, c.label);
      c.subcategories.forEach(sc => map.set(sc.id, sc.label));
    });
    return map;
  }, [categories]);

  const newProducts = products.filter(p => p.isNew);
  const restProducts = products.filter(p => !p.isNew).slice(0, 9);

  return (
    <div>
      {/* Hero */}
      <section className="bg-sage-500 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(26,36,32,0.45), rgba(26,36,32,0.45)), url(/images/hero-bg.png)" }}>
        <div className="max-w-[1320px] mx-auto px-6 py-10">
          <div className="text-white/60 text-sm mb-2">
            Главная <span className="mx-1">›</span> Новинки
          </div>
          <h1 className="font-brand text-4xl font-bold text-white">Новинки</h1>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-6 py-10">
        {/* New this week */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-brand text-2xl font-bold text-primary-900">Поступило недавно</h2>
            <span className="text-sm text-neutral-500">{newProducts.length} товаров</span>
          </div>
          {newProducts.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">
              <div className="text-4xl mb-4">🌸</div>
              <div className="font-medium text-neutral-600">Новинок пока нет</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {newProducts.map(p => <ProductCard key={p.id} p={p} categoryLabels={categoryLabels} />)}
            </div>
          )}
        </section>

        {/* Rest of catalog */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-brand text-2xl font-bold text-primary-900">Весь каталог</h2>
            <Link href="/catalog" className="text-sm text-primary-600 font-medium hover:text-primary-500 flex items-center gap-1">
              С фильтрами
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {restProducts.map(p => <ProductCard key={p.id} p={p} categoryLabels={categoryLabels} />)}
          </div>
          <div className="mt-8 text-center">
            <Link href="/catalog" className="inline-block px-7 py-3.5 bg-primary-600 hover:bg-primary-500 transition-colors rounded-full font-semibold text-white">
              Открыть весь каталог с фильтрами
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
