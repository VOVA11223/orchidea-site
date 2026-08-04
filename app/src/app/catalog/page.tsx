"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/lib/products-context";
import { useCategories } from "@/lib/categories-context";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCardImage from "@/components/ProductCardImage";
import Link from "next/link";
import { Suspense } from "react";

const SORT_OPTIONS = [
  { id: "default", label: "По умолчанию" },
  { id: "price_asc", label: "Цена ▲" },
  { id: "price_desc", label: "Цена ▼" },
  { id: "new", label: "Сначала новые" },
];

function CatalogInner() {
  const params = useSearchParams();
  const { products } = useProducts();
  const { categories } = useCategories();
  const initCat = params.get("cat") ?? "";
  const initQ = params.get("q") ?? "";

  const [cat, setCat] = useState(initCat);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [saleOnly, setSaleOnly] = useState(false);
  const [sort, setSort] = useState("default");
  const [q, setQ] = useState(initQ);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  const [priceBoundMin, priceBoundMax] = useMemo(() => {
    if (!products.length) return [0, 0];
    const prices = products.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  const priceFloor = minPrice ?? priceBoundMin;
  const priceCeiling = maxPrice ?? priceBoundMax;

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      if (cat) {
        const parent = categories.find(c => c.id === cat);
        if (parent && parent.subcategories.length > 0) {
          if (!parent.subcategories.some(sc => sc.id === p.category)) return false;
        } else if (p.category !== cat) {
          return false;
        }
      }
      if (inStockOnly && !p.inStock) return false;
      if (saleOnly && !p.isSale) return false;
      if (minPrice !== null && p.price < minPrice) return false;
      if (maxPrice !== null && p.price > maxPrice) return false;
      if (q && !(p.name ?? "").toLowerCase().includes(q.toLowerCase()) && !(p.article ?? "").toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [cat, inStockOnly, saleOnly, sort, q, products, minPrice, maxPrice]);

  useEffect(() => {
    setPage(1);
  }, [cat, inStockOnly, saleOnly, sort, q, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums = [1, 2, 3, 4, 5, 6];
    return [...nums, "...", totalPages] as (number | string)[];
  }, [totalPages]);

  // Метки категорий/подкатегорий из живого дерева — для заголовков, чипов и подписей на карточках
  const categoryLabels = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(c => {
      map.set(c.id, c.label);
      c.subcategories.forEach(sc => map.set(sc.id, sc.label));
    });
    return map;
  }, [categories]);

  // Товары со значением category, которого нет ни в одной категории/подкатегории —
  // показываем их как отдельные плоские пункты, чтобы они не пропадали из фильтра
  const orphanCategories = useMemo(() => {
    const known = new Set(categoryLabels.keys());
    const map = new Map<string, { id: string; label: string }>();
    products.forEach(p => {
      if (!known.has(p.category) && !map.has(p.category)) {
        map.set(p.category, { id: p.category, label: p.category });
      }
    });
    return Array.from(map.values());
  }, [products, categoryLabels]);

  const activeFiltersCount = (cat ? 1 : 0) + (inStockOnly ? 1 : 0) + (saleOnly ? 1 : 0) + (minPrice !== null || maxPrice !== null ? 1 : 0);

  function clearFilters() {
    setCat(""); setInStockOnly(false); setSaleOnly(false); setQ(""); setMinPrice(null); setMaxPrice(null);
  }

  const sidebarContent = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <div className="font-semibold text-foreground text-lg mb-3">Категория</div>
        <div className="space-y-2">
          <button
            onClick={() => setCat("")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-base border transition-colors ${
              !cat ? "bg-primary-600 text-white border-primary-600 font-semibold" : "bg-card text-foreground border-border hover:border-primary-400"
            }`}
          >
            Все категории
          </button>
          {categories.map(c => {
            const isExpanded = expandedCat === c.id;
            const hasSubcategories = c.subcategories.length > 0;
            return (
              <div key={c.id}>
                <button
                  onClick={() => {
                    setCat(c.id);
                    setExpandedCat(prev => prev === c.id ? null : c.id);
                  }}
                  className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2.5 rounded-xl text-base border transition-colors ${
                    cat === c.id ? "bg-primary-600 text-white border-primary-600 font-semibold" : "bg-card text-foreground border-border hover:border-primary-400"
                  }`}
                >
                  {c.label}
                  {hasSubcategories && (
                    <svg
                      className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </button>
                {hasSubcategories && isExpanded && (
                  <div className="mt-2 ml-3 flex flex-wrap gap-2">
                    {c.subcategories.map(sc => (
                      <button
                        key={sc.id}
                        onClick={() => setCat(sc.id)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          cat === sc.id ? "bg-primary-600 text-white border-primary-600 font-medium" : "bg-card text-muted-foreground border-border hover:border-primary-400"
                        }`}
                      >
                        {sc.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {orphanCategories.map(c => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-base border transition-colors ${
                cat === c.id ? "bg-primary-600 text-white border-primary-600 font-semibold" : "bg-card text-foreground border-border hover:border-primary-400"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setInStockOnly(v => !v)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            inStockOnly ? "bg-primary-600 text-white border-primary-600" : "bg-card text-foreground border-border hover:border-primary-400"
          }`}
        >
          В наличии
        </button>
        <button
          type="button"
          onClick={() => setSaleOnly(v => !v)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            saleOnly ? "bg-red-500 text-white border-red-500" : "bg-card text-foreground border-border hover:border-primary-400"
          }`}
        >
          Только акции
        </button>
      </div>

      {/* Price slider */}
      <div>
        <div className="font-semibold text-foreground text-sm mb-2">Цена</div>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            placeholder={String(priceBoundMin)}
            value={minPrice ?? ""}
            onChange={e => {
              const v = e.target.value === "" ? null : Number(e.target.value);
              setMinPrice(v !== null && maxPrice !== null && v > maxPrice ? maxPrice : v);
            }}
            className="w-full min-w-0 px-2 py-1.5 text-sm bg-input text-foreground border border-border rounded-lg focus:outline-none focus:border-primary-400"
          />
          <span className="text-muted-foreground text-sm flex-shrink-0">—</span>
          <input
            type="number"
            placeholder={String(priceBoundMax)}
            value={maxPrice ?? ""}
            onChange={e => {
              const v = e.target.value === "" ? null : Number(e.target.value);
              setMaxPrice(v !== null && minPrice !== null && v < minPrice ? minPrice : v);
            }}
            className="w-full min-w-0 px-2 py-1.5 text-sm bg-input text-foreground border border-border rounded-lg focus:outline-none focus:border-primary-400"
          />
        </div>
        <input
          type="range"
          min={priceBoundMin}
          max={priceBoundMax}
          value={priceCeiling}
          onChange={e => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary-600"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{priceFloor} ₽</span>
          <span>{priceCeiling} ₽</span>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <button onClick={clearFilters} className="w-full py-2 border border-border text-muted-foreground rounded-xl text-sm hover:bg-muted transition-colors">
          Сбросить фильтры ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  const pageTitle = cat ? categoryLabels.get(cat) ?? "Каталог" : "Каталог";

  return (
    <div>
      {/* Hero */}
      <section className="bg-sage-500 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(26,36,32,0.45), rgba(26,36,32,0.45)), url(/images/hero-bg.png)" }}>
        <div className="max-w-[1320px] mx-auto px-6 py-10">
          <div className="text-white/60 text-sm mb-2">
            Главная <span className="mx-1">›</span> Каталог
            {cat && <> <span className="mx-1">›</span> {pageTitle}</>}
          </div>
          <h1 className="font-brand text-3xl md:text-4xl font-bold text-white break-words">{pageTitle}</h1>
        </div>
      </section>

    <div className="max-w-[1320px] mx-auto px-6 py-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{filtered.length} товаров</p>
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="text-sm border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary-400 bg-card"
        >
          {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>

        {/* Mobile filter toggle */}
        <button
          className="md:hidden flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm text-foreground"
          onClick={() => setSidebarOpen(v => !v)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <line x1={4} y1={6} x2={11} y2={6} /><line x1={16} y1={6} x2={20} y2={6} />
            <line x1={4} y1={12} x2={8} y2={12} /><line x1={13} y1={12} x2={20} y2={12} />
            <line x1={4} y1={18} x2={11} y2={18} /><line x1={16} y1={18} x2={20} y2={18} />
          </svg>
          Фильтры {activeFiltersCount > 0 && <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFiltersCount}</span>}
        </button>
      </div>

      {/* Active filter chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {cat && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary-600 text-white text-xs rounded-full font-medium">
              {categoryLabels.get(cat)}
              <button onClick={() => setCat("")}>×</button>
            </span>
          )}
          {inStockOnly && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary-600 text-white text-xs rounded-full font-medium">
              В наличии <button onClick={() => setInStockOnly(false)}>×</button>
            </span>
          )}
          {saleOnly && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
              Акции <button onClick={() => setSaleOnly(false)}>×</button>
            </span>
          )}
          <button onClick={clearFilters} className="flex items-center px-3 py-1 bg-white text-foreground text-xs font-medium border border-border rounded-full hover:bg-muted transition-colors">
            Сбросить всё
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          {sidebarContent}
        </aside>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-card p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="font-semibold text-foreground">Фильтры</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Закрыть"
                  className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-muted-foreground hover:bg-neutral-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} />
                  </svg>
                </button>
              </div>
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="text-4xl mb-4">🌸</div>
              <div className="font-medium text-foreground mb-4">Ничего не найдено</div>
              <button
                onClick={clearFilters}
                className="inline-block px-6 py-2.5 bg-primary-600 hover:bg-primary-500 transition-colors rounded-full font-semibold text-white text-sm"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {paged.map(p => (
                <div key={p.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col">
                  <div className="relative">
                    <ProductCardImage images={p.images} className="h-44" />
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
                      <div className="h-3.5 mb-2 flex items-center gap-1">
                        {p.colors.map((hex, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border-2 border-neutral-300"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
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
          )}

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
            <div className="flex items-center justify-center gap-2.5 sm:gap-2 flex-wrap border border-border rounded-full px-3 py-2 bg-card">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-11 h-11 sm:w-9 sm:h-9 rounded-full text-base sm:text-sm text-muted-foreground hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
                aria-label="Предыдущая страница"
              >
                «
              </button>
              {pageNumbers.map((n, i) =>
                n === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-muted-foreground">...</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(n as number)}
                    className={`w-11 h-11 sm:w-9 sm:h-9 rounded-full text-base sm:text-sm font-medium transition-colors ${
                      currentPage === n
                        ? "bg-primary-600 text-white"
                        : "text-muted-foreground hover:bg-neutral-100"
                    }`}
                  >
                    {n}
                  </button>
                )
              )}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-11 h-11 sm:w-9 sm:h-9 rounded-full text-base sm:text-sm text-muted-foreground hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
                aria-label="Следующая страница"
              >
                »
              </button>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Информационный текст */}
      <div className="bg-muted relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply pointer-events-none"
          style={{ backgroundImage: "url(/images/paper-texture.jpg)" }}
        />
        <div className="max-w-[1320px] mx-auto px-6 py-8 md:py-14 text-muted-foreground leading-relaxed space-y-4 relative">
          <p className="hidden md:block">
            Предлагаем Вам искусственные цветы оптом.
            Искусственные цветы не нужно поливать, удобрять, пересаживать, прятать от сквозняков
            и носить по квартире в поисках идеального освещения. Они стойко переносят взаимодействие с детьми
            и животными: кот не съест любимую пальму, а ребенок не устроит на подоконнике песочницу.
            Такие растения станут настоящим спасением для аллергиков и порадуют тех,
            кто мечтает о зелени в квартире, но никак не освоит тонкости ботаники.
          </p>
          <p className="hidden md:block">
            Кроме всего прочего современные материалы, которые используют для изготовления
            искусственных растений совсем не токсичны и никак не вредят окружающей среде.
          </p>
          <p className="text-base md:text-lg font-medium text-primary-900">
            Мы предлагаем широкий выбор искусственных цветов различных размеров,
            форм и оттенков, которые будут уместны в самых разных жизненных ситуациях.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogInner />
    </Suspense>
  );
}
