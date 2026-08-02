"use client";
import Link from "next/link";
import { useState } from "react";
import { useCategories } from "@/lib/categories-context";

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory } = useCategories();

  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryLabel, setEditingCategoryLabel] = useState("");

  const [subInputs, setSubInputs] = useState<Record<string, string>>({});
  const [editingSub, setEditingSub] = useState<{ categoryId: string; subcategoryId: string } | null>(null);
  const [editingSubLabel, setEditingSubLabel] = useState("");

  const inputClass = "w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-400";

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newCategory.trim();
    if (!label) return;
    addCategory(label);
    setNewCategory("");
  };

  const startEditCategory = (id: string, label: string) => {
    setEditingCategoryId(id);
    setEditingCategoryLabel(label);
  };

  const saveEditCategory = () => {
    if (editingCategoryId && editingCategoryLabel.trim()) {
      updateCategory(editingCategoryId, editingCategoryLabel.trim());
    }
    setEditingCategoryId(null);
    setEditingCategoryLabel("");
  };

  const handleDeleteCategory = (id: string, label: string) => {
    if (confirm(`Удалить категорию «${label}» вместе со всеми подкатегориями?`)) {
      deleteCategory(id);
    }
  };

  const handleAddSubcategory = (categoryId: string) => {
    const label = (subInputs[categoryId] ?? "").trim();
    if (!label) return;
    addSubcategory(categoryId, label);
    setSubInputs(prev => ({ ...prev, [categoryId]: "" }));
  };

  const startEditSub = (categoryId: string, subcategoryId: string, label: string) => {
    setEditingSub({ categoryId, subcategoryId });
    setEditingSubLabel(label);
  };

  const saveEditSub = () => {
    if (editingSub && editingSubLabel.trim()) {
      updateSubcategory(editingSub.categoryId, editingSub.subcategoryId, editingSubLabel.trim());
    }
    setEditingSub(null);
    setEditingSubLabel("");
  };

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string, label: string) => {
    if (confirm(`Удалить подкатегорию «${label}»?`)) {
      deleteSubcategory(categoryId, subcategoryId);
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

      <div className="max-w-[1320px] mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add category form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 border border-neutral-200 sticky top-6">
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
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <div className="bg-neutral-50 px-8 py-4 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-primary-900">Категории ({categories.length})</h2>
              </div>

              <div className="divide-y divide-neutral-100">
                {categories.map(cat => (
                  <div key={cat.id} className="px-8 py-5">
                    <div className="flex items-center justify-between gap-3">
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
                          <div>
                            <div className="font-semibold text-neutral-900">{cat.label}</div>
                            <div className="text-xs text-neutral-400 font-mono">{cat.id}</div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
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
                    <div className="mt-3 ml-4 pl-4 border-l border-neutral-200 space-y-2">
                      {cat.subcategories.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between gap-3">
                          {editingSub?.categoryId === cat.id && editingSub?.subcategoryId === sub.id ? (
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
                              <div>
                                <span className="text-sm text-neutral-700">{sub.label}</span>
                                <span className="text-xs text-neutral-400 font-mono ml-2">{sub.id}</span>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
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
                      ))}

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
                ))}

                {categories.length === 0 && (
                  <div className="px-8 py-10 text-center text-neutral-400 text-sm">Категорий пока нет</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
