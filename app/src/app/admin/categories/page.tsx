"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCategories } from "@/lib/categories-context";

const GRIP = (
  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
    <circle cx="6" cy="5" r="1.4" /><circle cx="14" cy="5" r="1.4" />
    <circle cx="6" cy="10" r="1.4" /><circle cx="14" cy="10" r="1.4" />
    <circle cx="6" cy="15" r="1.4" /><circle cx="14" cy="15" r="1.4" />
  </svg>
);

const CHEVRON_UP = (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="m18 15-6-6-6 6" />
  </svg>
);

const CHEVRON_DOWN = (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const moveButtonClass = "w-7 h-7 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-neutral-100 transition-colors rounded text-neutral-500 flex-shrink-0";

function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export default function AdminCategoriesPage() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    reorderSubcategories,
  } = useCategories();

  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryLabel, setEditingCategoryLabel] = useState("");

  const [subInputs, setSubInputs] = useState<Record<string, string>>({});
  const [editingSub, setEditingSub] = useState<{ categoryId: string; subcategoryId: string } | null>(null);
  const [editingSubLabel, setEditingSubLabel] = useState("");

  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);
  const [draggedSub, setDraggedSub] = useState<{ categoryId: string; subcategoryId: string } | null>(null);
  const [dragOverSubId, setDragOverSubId] = useState<string | null>(null);

  // Local working order — drag only reorders these; nothing is persisted
  // until "Сохранить порядок" is clicked.
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [subOrders, setSubOrders] = useState<Record<string, string[]>>({});
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    setCategoryOrder(prev => {
      const validPrev = prev.filter(id => categories.some(c => c.id === id));
      const newIds = categories.map(c => c.id).filter(id => !validPrev.includes(id));
      return [...validPrev, ...newIds];
    });
    setSubOrders(prev => {
      const next: Record<string, string[]> = {};
      categories.forEach(cat => {
        const validPrev = (prev[cat.id] ?? []).filter(id => cat.subcategories.some(s => s.id === id));
        const newIds = cat.subcategories.map(s => s.id).filter(id => !validPrev.includes(id));
        next[cat.id] = [...validPrev, ...newIds];
      });
      return next;
    });
  }, [categories]);

  const orderedCategories = categoryOrder
    .map(id => categories.find(c => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const isOrderDirty = useMemo(() => {
    if (!arraysEqual(categoryOrder, categories.map(c => c.id))) return true;
    return categories.some(cat => {
      const order = subOrders[cat.id] ?? cat.subcategories.map(s => s.id);
      return !arraysEqual(order, cat.subcategories.map(s => s.id));
    });
  }, [categoryOrder, subOrders, categories]);

  async function handleSaveOrder() {
    setSavingOrder(true);
    try {
      if (!arraysEqual(categoryOrder, categories.map(c => c.id))) {
        await reorderCategories(categoryOrder);
      }
      for (const cat of categories) {
        const order = subOrders[cat.id] ?? cat.subcategories.map(s => s.id);
        if (!arraysEqual(order, cat.subcategories.map(s => s.id))) {
          await reorderSubcategories(cat.id, order);
        }
      }
    } catch (err) {
      reportError(err);
    } finally {
      setSavingOrder(false);
    }
  }

  function handleCategoryDrop(overId: string) {
    const draggedId = draggedCategoryId;
    setDraggedCategoryId(null);
    setDragOverCategoryId(null);
    if (!draggedId || draggedId === overId) return;
    setCategoryOrder(prev => {
      const ids = [...prev];
      const fromIndex = ids.indexOf(draggedId);
      const toIndex = ids.indexOf(overId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      ids.splice(fromIndex, 1);
      ids.splice(toIndex, 0, draggedId);
      return ids;
    });
  }

  function handleSubDrop(categoryId: string, overSubId: string) {
    const dragged = draggedSub;
    setDraggedSub(null);
    setDragOverSubId(null);
    if (!dragged || dragged.categoryId !== categoryId || dragged.subcategoryId === overSubId) return;
    setSubOrders(prev => {
      const ids = [...(prev[categoryId] ?? [])];
      const fromIndex = ids.indexOf(dragged.subcategoryId);
      const toIndex = ids.indexOf(overSubId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      ids.splice(fromIndex, 1);
      ids.splice(toIndex, 0, dragged.subcategoryId);
      return { ...prev, [categoryId]: ids };
    });
  }

  // Buttons that move an item one slot up/down — the touch-friendly fallback
  // for reordering, since native HTML5 drag-and-drop (used above) never
  // fires from touch input on iOS/Android.
  function moveCategory(id: string, direction: -1 | 1) {
    setCategoryOrder(prev => {
      const idx = prev.indexOf(id);
      const swapIdx = idx + direction;
      if (idx === -1 || swapIdx < 0 || swapIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }

  function moveSubcategory(categoryId: string, order: string[], subId: string, direction: -1 | 1) {
    const idx = order.indexOf(subId);
    const swapIdx = idx + direction;
    if (idx === -1 || swapIdx < 0 || swapIdx >= order.length) return;
    const next = [...order];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    setSubOrders(prev => ({ ...prev, [categoryId]: next }));
  }

  const inputClass = "w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-400";

  function reportError(err: unknown) {
    alert(err instanceof Error ? err.message : "Не удалось выполнить действие");
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const label = newCategory.trim();
    if (!label) return;
    try {
      await addCategory(label);
      setNewCategory("");
    } catch (err) {
      reportError(err);
    }
  };

  const startEditCategory = (id: string, label: string) => {
    setEditingCategoryId(id);
    setEditingCategoryLabel(label);
  };

  const saveEditCategory = async () => {
    if (editingCategoryId && editingCategoryLabel.trim()) {
      try {
        await updateCategory(editingCategoryId, editingCategoryLabel.trim());
      } catch (err) {
        reportError(err);
      }
    }
    setEditingCategoryId(null);
    setEditingCategoryLabel("");
  };

  const handleDeleteCategory = async (id: string, label: string) => {
    if (confirm(`Удалить категорию «${label}» вместе со всеми подкатегориями?`)) {
      try {
        await deleteCategory(id);
      } catch (err) {
        reportError(err);
      }
    }
  };

  const handleAddSubcategory = async (categoryId: string) => {
    const label = (subInputs[categoryId] ?? "").trim();
    if (!label) return;
    try {
      await addSubcategory(categoryId, label);
      setSubInputs(prev => ({ ...prev, [categoryId]: "" }));
    } catch (err) {
      reportError(err);
    }
  };

  const startEditSub = (categoryId: string, subcategoryId: string, label: string) => {
    setEditingSub({ categoryId, subcategoryId });
    setEditingSubLabel(label);
  };

  const saveEditSub = async () => {
    if (editingSub && editingSubLabel.trim()) {
      try {
        await updateSubcategory(editingSub.categoryId, editingSub.subcategoryId, editingSubLabel.trim());
      } catch (err) {
        reportError(err);
      }
    }
    setEditingSub(null);
    setEditingSubLabel("");
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string, label: string) => {
    if (confirm(`Удалить подкатегорию «${label}»?`)) {
      try {
        await deleteSubcategory(categoryId, subcategoryId);
      } catch (err) {
        reportError(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="bg-sage-500 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(26,36,32,0.45), rgba(26,36,32,0.45)), url(/images/hero-bg.png)" }}>
        <div className="max-w-[1320px] mx-auto px-6 py-10">
          <div className="text-white/60 text-sm mb-2">
            <Link href="/admin" className="hover:text-white transition-colors">Админ-панель</Link> <span className="mx-1">›</span> Категории
          </div>
          <h1 className="font-brand text-4xl font-bold text-white">Управление каталогом</h1>
          <p className="text-white/80 mt-1">Категории и подкатегории товаров</p>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-8 md:py-14">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add category form */}
          <div className="min-w-0 lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 md:p-8 border border-neutral-200 lg:sticky lg:top-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-6">Добавить категорию</h2>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1">Название категории *</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="Например, Ромашки"
                    className={inputClass}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-500 transition-colors rounded-full text-white font-medium"
                >
                  Добавить
                </button>
              </form>
            </div>
          </div>

          {/* Categories list */}
          <div className="min-w-0 lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <div className="bg-neutral-50 px-4 md:px-8 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-primary-900">Категории ({categories.length})</h2>
                {isOrderDirty && (
                  <button
                    onClick={handleSaveOrder}
                    disabled={savingOrder}
                    className="px-4 py-1.5 bg-primary-600 hover:bg-primary-500 disabled:bg-neutral-300 transition-colors rounded-full text-white text-sm font-medium flex-shrink-0"
                  >
                    {savingOrder ? "Сохранение…" : "Сохранить порядок"}
                  </button>
                )}
              </div>

              <div className="divide-y divide-neutral-100">
                {orderedCategories.map((cat, catIndex) => {
                  const subOrder = subOrders[cat.id] ?? cat.subcategories.map(s => s.id);
                  const orderedSubs = subOrder
                    .map(subId => cat.subcategories.find(s => s.id === subId))
                    .filter((s): s is NonNullable<typeof s> => Boolean(s));
                  return (
                  <div
                    key={cat.id}
                    draggable={editingCategoryId !== cat.id}
                    onDragStart={() => setDraggedCategoryId(cat.id)}
                    onDragOver={e => { e.preventDefault(); setDragOverCategoryId(cat.id); }}
                    onDragLeave={() => setDragOverCategoryId(prev => (prev === cat.id ? null : prev))}
                    onDrop={e => { e.preventDefault(); handleCategoryDrop(cat.id); }}
                    onDragEnd={() => { setDraggedCategoryId(null); setDragOverCategoryId(null); }}
                    className={`px-4 md:px-8 py-4 md:py-5 transition-colors ${draggedCategoryId === cat.id ? "opacity-40" : ""} ${dragOverCategoryId === cat.id && draggedCategoryId !== cat.id ? "bg-primary-50/60" : ""}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {editingCategoryId === cat.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editingCategoryLabel}
                            onChange={e => setEditingCategoryLabel(e.target.value)}
                            className={inputClass}
                            autoFocus
                          />
                          <button onClick={saveEditCategory} className="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 transition-colors rounded text-primary-700 text-xs font-medium flex-shrink-0">
                            Сохранить
                          </button>
                          <button onClick={() => setEditingCategoryId(null)} className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded text-neutral-600 text-xs font-medium flex-shrink-0">
                            Отмена
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="hidden sm:inline text-neutral-300 cursor-grab active:cursor-grabbing flex-shrink-0" title="Перетащить для изменения порядка">
                              {GRIP}
                            </span>
                            <div className="min-w-0">
                              <div className="font-semibold text-neutral-900 truncate">{cat.label}</div>
                              <div className="text-xs text-neutral-400 font-mono truncate">{cat.id}</div>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0 flex-wrap">
                            <button
                              onClick={() => moveCategory(cat.id, -1)}
                              disabled={catIndex === 0}
                              aria-label="Переместить категорию выше"
                              className={moveButtonClass}
                            >
                              {CHEVRON_UP}
                            </button>
                            <button
                              onClick={() => moveCategory(cat.id, 1)}
                              disabled={catIndex === orderedCategories.length - 1}
                              aria-label="Переместить категорию ниже"
                              className={moveButtonClass}
                            >
                              {CHEVRON_DOWN}
                            </button>
                            <button
                              onClick={() => startEditCategory(cat.id, cat.label)}
                              className="px-3 py-1 bg-primary-50 hover:bg-primary-100 transition-colors rounded text-primary-700 text-xs font-medium"
                            >
                              Изменить
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.label)}
                              className="px-3 py-1 bg-red-50 hover:bg-red-100 transition-colors rounded text-red-600 text-xs font-medium"
                            >
                              Удалить
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Subcategories */}
                    <div className="mt-3 ml-2 pl-3 md:ml-4 md:pl-4 border-l border-neutral-200 space-y-2">
                      {orderedSubs.map((sub, subIndex) => {
                        const isEditingThis = editingSub?.categoryId === cat.id && editingSub?.subcategoryId === sub.id;
                        return (
                        <div
                          key={sub.id}
                          draggable={!isEditingThis}
                          onDragStart={e => { e.stopPropagation(); setDraggedSub({ categoryId: cat.id, subcategoryId: sub.id }); }}
                          onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOverSubId(sub.id); }}
                          onDragLeave={() => setDragOverSubId(prev => (prev === sub.id ? null : prev))}
                          onDrop={e => { e.preventDefault(); e.stopPropagation(); handleSubDrop(cat.id, sub.id); }}
                          onDragEnd={() => { setDraggedSub(null); setDragOverSubId(null); }}
                          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded transition-colors ${draggedSub?.subcategoryId === sub.id ? "opacity-40" : ""} ${dragOverSubId === sub.id && draggedSub?.subcategoryId !== sub.id ? "bg-primary-50/60" : ""}`}
                        >
                          {isEditingThis ? (
                            <div className="flex-1 flex items-center gap-2">
                              <input
                                type="text"
                                value={editingSubLabel}
                                onChange={e => setEditingSubLabel(e.target.value)}
                                className={inputClass}
                                autoFocus
                              />
                              <button onClick={saveEditSub} className="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 transition-colors rounded text-primary-700 text-xs font-medium flex-shrink-0">
                                Сохранить
                              </button>
                              <button onClick={() => setEditingSub(null)} className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded text-neutral-600 text-xs font-medium flex-shrink-0">
                                Отмена
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="hidden sm:inline text-neutral-300 cursor-grab active:cursor-grabbing flex-shrink-0" title="Перетащить для изменения порядка">
                                  {GRIP}
                                </span>
                                <div className="min-w-0">
                                  <span className="text-sm text-neutral-700 truncate">{sub.label}</span>
                                  <span className="text-xs text-neutral-400 font-mono ml-2">{sub.id}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0 flex-wrap">
                                <button
                                  onClick={() => moveSubcategory(cat.id, subOrder, sub.id, -1)}
                                  disabled={subIndex === 0}
                                  aria-label="Переместить подкатегорию выше"
                                  className={moveButtonClass}
                                >
                                  {CHEVRON_UP}
                                </button>
                                <button
                                  onClick={() => moveSubcategory(cat.id, subOrder, sub.id, 1)}
                                  disabled={subIndex === orderedSubs.length - 1}
                                  aria-label="Переместить подкатегорию ниже"
                                  className={moveButtonClass}
                                >
                                  {CHEVRON_DOWN}
                                </button>
                                <button
                                  onClick={() => startEditSub(cat.id, sub.id, sub.label)}
                                  className="px-2.5 py-1 bg-primary-50 hover:bg-primary-100 transition-colors rounded text-primary-700 text-xs font-medium"
                                >
                                  Изменить
                                </button>
                                <button
                                  onClick={() => handleDeleteSubcategory(cat.id, sub.id, sub.label)}
                                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 transition-colors rounded text-red-600 text-xs font-medium"
                                >
                                  Удалить
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                        );
                      })}

                      {/* Add subcategory */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={subInputs[cat.id] ?? ""}
                          onChange={e => setSubInputs(prev => ({ ...prev, [cat.id]: e.target.value }))}
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSubcategory(cat.id);
                            }
                          }}
                          placeholder="Новая подкатегория"
                          className="flex-1 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-400"
                        />
                        <button
                          onClick={() => handleAddSubcategory(cat.id)}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-lg text-neutral-600 text-xs font-medium flex-shrink-0"
                        >
                          Добавить
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}

                {categories.length === 0 && (
                  <div className="px-4 md:px-8 py-10 text-center text-neutral-400 text-sm">Категорий пока нет</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
