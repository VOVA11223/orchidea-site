"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useProducts } from "@/lib/products-context";
import type { Product } from "@/lib/products-context";
import { useCategories } from "@/lib/categories-context";

const COLOR_PALETTE = [
  { hex: "#e53e3e", name: "Красный" },
  { hex: "#9b2c2c", name: "Бордовый" },
  { hex: "#fc8181", name: "Розовый" },
  { hex: "#ed64a6", name: "Малиновый" },
  { hex: "#d53f8c", name: "Фуксия" },
  { hex: "#d69fb0", name: "Пудровый" },
  { hex: "#fbb6ce", name: "Персиковый" },
  { hex: "#ff8a65", name: "Коралловый" },
  { hex: "#f97316", name: "Оранжевый" },
  { hex: "#dd6b20", name: "Терракотовый" },
  { hex: "#f6e05e", name: "Жёлтый" },
  { hex: "#faf089", name: "Светло-жёлтый" },
  { hex: "#d4af37", name: "Золотой" },
  { hex: "#fdf6e3", name: "Кремовый" },
  { hex: "#f7fafc", name: "Белый" },
  { hex: "#48bb78", name: "Зелёный" },
  { hex: "#276749", name: "Тёмно-зелёный" },
  { hex: "#68d391", name: "Мятный" },
  { hex: "#38b2ac", name: "Бирюзовый" },
  { hex: "#3182ce", name: "Синий" },
  { hex: "#2c5282", name: "Тёмно-синий" },
  { hex: "#63b3ed", name: "Голубой" },
  { hex: "#6b46c1", name: "Фиолетовый" },
  { hex: "#b794f4", name: "Лиловый" },
  { hex: "#d6bcfa", name: "Сиреневый" },
  { hex: "#a0aec0", name: "Серебристый" },
  { hex: "#718096", name: "Серый" },
  { hex: "#744210", name: "Коричневый" },
  { hex: "#1a202c", name: "Чёрный" },
];

const EMPTY_PRODUCT: Product = {
  id: "",
  name: "",
  article: "",
  code: "",
  category: "",
  price: 0,
  minQty: 0,
  height: "",
  budCount: "",
  colors: [],
  img: "/images/roses.jpg",
  images: [],
  inStock: true,
  isNew: false,
  isSale: false,
  oldPrice: "",
};

const collator = new Intl.Collator("ru");

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const categoriesAlphabetical = [...categories]
    .sort((a, b) => collator.compare(a.label, b.label))
    .map(c => ({
      ...c,
      subcategories: [...c.subcategories].sort((a, b) => collator.compare(a.label, b.label)),
    }));
  const [formData, setFormData] = useState<Product>(EMPTY_PRODUCT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const filteredProducts = products.filter(p => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  const toggleColor = (hex: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(hex) ? prev.colors.filter(c => c !== hex) : [...prev.colors, hex]
    }));
  };

  useEffect(() => {
    if (!colorPickerOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setColorPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [colorPickerOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const isNumericField = name === "price" || name === "minQty" || name === "height" || name === "oldPrice" || name === "budCount";
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (isNumericField ? (value === "" ? "" : parseFloat(value)) : value)
    }));
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setFormError(null);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "Не удалось загрузить фото");
        uploaded.push(data.url);
      }
      setFormData(prev => {
        const images = [...prev.images, ...uploaded];
        return { ...prev, images, img: images[0] ?? prev.img };
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Не удалось загрузить фото");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const images = prev.images.filter((_, i) => i !== index);
      return { ...prev, images, img: images[0] ?? EMPTY_PRODUCT.img };
    });
  };

  const reorderImages = (from: number, to: number) => {
    if (from === to) return;
    setFormData(prev => {
      const images = [...prev.images];
      const [moved] = images.splice(from, 1);
      images.splice(to, 0, moved);
      return { ...prev, images, img: images[0] ?? prev.img };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && products.some(p => p.id === formData.id)) {
      setFormError(`Товар с артикулом "${formData.id}" уже существует. Укажите другой артикул.`);
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingId) {
        await updateProduct(editingId, { ...formData, id: editingId, article: editingId });
        setEditingId(null);
      } else {
        await addProduct({ ...formData, id: formData.id, article: formData.id });
      }
      setFormData(EMPTY_PRODUCT);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Не удалось сохранить товар");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Не удалось удалить товар");
    }
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-400";
  const labelClass = "block text-sm font-medium text-neutral-600 mb-1";

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="bg-sage-500 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(26,36,32,0.45), rgba(26,36,32,0.45)), url(/images/hero-bg.png)" }}>
        <div className="max-w-[1320px] mx-auto px-6 py-10">
          <div className="text-white/60 text-sm mb-2">
            <Link href="/admin" className="hover:text-white transition-colors">Админ-панель</Link> <span className="mx-1">›</span> Товары
          </div>
          <h1 className="font-brand text-4xl font-bold text-white">Управление товарами</h1>
          <p className="text-white/80 mt-1">Добавление и редактирование цветов</p>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 gap-8">
          {/* Form */}
          <div className="min-w-0">
            <div className="bg-white rounded-2xl p-8 border border-neutral-200">
              <h2 className="text-xl font-semibold text-primary-900 mb-6">
                {editingId ? "Редактировать товар" : "Добавить новый товар"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>Артикул *</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="or-3291"
                    className={inputClass}
                    required
                    disabled={editingId !== null}
                  />
                </div>

                <div>
                  <label className={labelClass}>Код</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="ORH-001"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Название *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Орхидея Фаленопсис лиловая 80 см"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Категория</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="" disabled>Выберите категорию</option>
                    {categoriesAlphabetical.map(c =>
                      c.subcategories.length > 0 ? (
                        <optgroup key={c.id} label={c.label}>
                          <option value={c.id}>{c.label}</option>
                          {c.subcategories.map(sc => (
                            <option key={sc.id} value={sc.id}>— {sc.label}</option>
                          ))}
                        </optgroup>
                      ) : (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Цена ₽ *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleChange}
                    onWheel={e => e.currentTarget.blur()}
                    placeholder="110"
                    step="0.01"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Упаковка *</label>
                  <input
                    type="number"
                    name="minQty"
                    value={formData.minQty || ""}
                    onChange={handleChange}
                    onWheel={e => e.currentTarget.blur()}
                    placeholder="5"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Высота см</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    onWheel={e => e.currentTarget.blur()}
                    placeholder="80"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Количество голов</label>
                  <input
                    type="number"
                    name="budCount"
                    value={formData.budCount}
                    onChange={handleChange}
                    onWheel={e => e.currentTarget.blur()}
                    placeholder="5"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Цвета в упаковке</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {formData.colors.map(hex => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => toggleColor(hex)}
                        title={COLOR_PALETTE.find(c => c.hex === hex)?.name ?? hex}
                        className="relative w-8 h-8 rounded-full border-2 border-neutral-300 group"
                        style={{ backgroundColor: hex }}
                      >
                        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                      </button>
                    ))}

                    <div className="relative" ref={colorPickerRef}>
                      <button
                        type="button"
                        onClick={() => setColorPickerOpen(o => !o)}
                        aria-expanded={colorPickerOpen}
                        aria-label="Добавить цвет"
                        className="w-8 h-8 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 hover:border-primary-400 hover:text-primary-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} />
                        </svg>
                      </button>

                      {colorPickerOpen && (
                        <div className="absolute z-20 top-full left-0 mt-2 p-3 bg-white border border-neutral-200 rounded-xl shadow-lg grid grid-cols-6 gap-2 w-56">
                          {COLOR_PALETTE.map(({ hex, name }) => {
                            const selected = formData.colors.includes(hex);
                            return (
                              <button
                                key={hex}
                                type="button"
                                onClick={() => toggleColor(hex)}
                                title={name}
                                aria-pressed={selected}
                                className={`relative w-8 h-8 rounded-full border transition-transform ${
                                  selected ? "border-primary-600 ring-2 ring-primary-600 ring-offset-2 scale-105" : "border-neutral-200 hover:scale-105"
                                }`}
                                style={{ backgroundColor: hex }}
                              >
                                {selected && (
                                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary-600 border-2 border-white flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Фото товара</label>
                  <input
                    type="file"
                    onChange={handleImagesUpload}
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-500 focus:outline-none focus:border-primary-400 file:bg-primary-600 file:border-0 file:rounded-full file:px-3 file:py-1 file:text-white file:cursor-pointer file:mr-2 disabled:opacity-60"
                  />
                  {uploading && <p className="mt-2 text-xs text-neutral-400">Загрузка фото...</p>}
                  {formData.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {formData.images.map((src, i) => (
                        <div
                          key={src + i}
                          data-img-index={i}
                          onPointerDown={e => {
                            setDragIndex(i);
                            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                          }}
                          onPointerMove={e => {
                            if (dragIndex === null) return;
                            const el = document.elementFromPoint(e.clientX, e.clientY);
                            const target = el?.closest<HTMLElement>("[data-img-index]");
                            if (target) {
                              const idx = Number(target.dataset.imgIndex);
                              if (!Number.isNaN(idx)) setOverIndex(idx);
                            }
                          }}
                          onPointerUp={() => {
                            if (dragIndex !== null && overIndex !== null) reorderImages(dragIndex, overIndex);
                            setDragIndex(null);
                            setOverIndex(null);
                          }}
                          onPointerCancel={() => {
                            setDragIndex(null);
                            setOverIndex(null);
                          }}
                          className={`relative rounded-lg overflow-hidden border cursor-move select-none touch-none group ${
                            i === 0 ? "border-primary-400 ring-2 ring-primary-200" : "border-neutral-200"
                          } ${dragIndex === i ? "opacity-50" : ""} ${
                            overIndex === i && dragIndex !== null && dragIndex !== i ? "ring-2 ring-primary-500" : ""
                          }`}
                        >
                          <img src={src} alt={`Фото ${i + 1}`} className="w-full h-20 object-contain bg-white pointer-events-none" draggable={false} />
                          {i === 0 && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary-600 text-white text-[10px] rounded">Обложка</span>
                          )}
                          <button
                            type="button"
                            onPointerDown={e => e.stopPropagation()}
                            onClick={() => removeImage(i)}
                            aria-label="Удалить фото"
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs flex items-center justify-center transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {formData.images.length > 1 && (
                    <p className="mt-2 text-xs text-neutral-400">Перетащите фото, чтобы изменить порядок. Первое фото — обложка товара.</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Старая цена (если скидка)</label>
                  <input
                    type="number"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    onWheel={e => e.currentTarget.blur()}
                    placeholder="0"
                    step="0.01"
                    className={inputClass}
                  />
                  {formData.isSale && !formData.oldPrice && (
                    <p className="mt-1 text-xs text-neutral-400">Без старой цены на странице «Акции» товар будет просто отмечен как акционный, без зачёркнутой цены.</p>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleChange}
                      className="w-4 h-4 accent-primary-600"
                    />
                    <span className="text-sm text-neutral-600">В наличии</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isNew"
                      checked={formData.isNew}
                      onChange={handleChange}
                      className="w-4 h-4 accent-primary-600"
                    />
                    <span className="text-sm text-neutral-600">Новинка</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isSale"
                      checked={formData.isSale}
                      onChange={handleChange}
                      className="w-4 h-4 accent-primary-600"
                    />
                    <span className="text-sm text-neutral-600">Акция</span>
                  </label>
                </div>

                {formError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{formError}</p>
                )}

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-500 transition-colors rounded-full text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Сохранение..." : editingId ? "Сохранить" : "Добавить"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormData(EMPTY_PRODUCT);
                        setFormError(null);
                      }}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full text-neutral-600"
                    >
                      Отмена
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Products list */}
          <div className="min-w-0">
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <div className="bg-neutral-50 px-8 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-primary-900">
                  Товары в каталоге ({filteredProducts.length}{search.trim() ? ` из ${products.length}` : ""})
                </h2>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Поиск по названию или артикулу"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-400"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx={11} cy={11} r={8} />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Фото</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Артикул</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Название</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Цена</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Кол-во</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Цвета</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Статус</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-3">
                          <img
                            src={product.img}
                            alt={product.name}
                            className="w-12 h-12 object-contain bg-white rounded"
                          />
                        </td>
                        <td className="px-6 py-3 text-sm text-neutral-500 font-mono">{product.id}</td>
                        <td className="px-6 py-3 text-sm text-neutral-900">{product.name.substring(0, 40)}...</td>
                        <td className="px-6 py-3 text-sm text-primary-700 font-semibold">{product.price} ₽</td>
                        <td className="px-6 py-3 text-sm text-neutral-500">от {product.minQty} шт</td>
                        <td className="px-6 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {product.colors.map(hex => (
                              <span key={hex} className="w-4 h-4 rounded-full border-2 border-neutral-300" style={{ backgroundColor: hex }} />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <div className="flex gap-1 flex-wrap">
                            {product.inStock
                              ? <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">В наличии</span>
                              : <span className="px-2 py-1 bg-neutral-200 text-neutral-500 rounded text-xs">Не в наличии</span>}
                            {product.isNew && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">НОВИНКА</span>}
                            {product.isSale && <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">Акция</span>}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-right space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-3 py-1 bg-primary-50 hover:bg-primary-100 transition-colors rounded text-primary-700 text-xs font-medium"
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 transition-colors rounded text-red-600 text-xs font-medium"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
