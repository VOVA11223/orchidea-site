"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Subcategory {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  subcategories: Subcategory[];
}

interface CategoriesContextType {
  categories: Category[];
  isLoaded: boolean;
  addCategory: (label: string) => Promise<void>;
  updateCategory: (id: string, label: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (orderedIds: string[]) => Promise<void>;
  addSubcategory: (categoryId: string, label: string) => Promise<void>;
  updateSubcategory: (categoryId: string, subcategoryId: string, label: string) => Promise<void>;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => Promise<void>;
  reorderSubcategories: (categoryId: string, orderedSubIds: string[]) => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
  й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
  э: "e", ю: "yu", я: "ya",
};

function slugify(label: string): string {
  const base = label
    .toLowerCase()
    .split("")
    .map(ch => TRANSLIT[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "category";
}

function uniqueId(label: string, taken: string[]): string {
  const base = slugify(label);
  if (!taken.includes(base)) return base;
  let n = 2;
  while (taken.includes(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

async function readJsonOrThrow(res: Response) {
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.ok) {
    throw new Error(body?.error || `Запрос не выполнен (${res.status})`);
  }
  return body;
}

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(body => setCategories(body.ok ? body.categories : []))
      .catch(() => setCategories([]))
      .finally(() => setIsLoaded(true));
  }, []);

  const addCategory = async (label: string) => {
    const id = uniqueId(label, categories.map(c => c.id));
    const category: Category = { id, label, subcategories: [] };
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    const body = await readJsonOrThrow(res);
    setCategories(prev => [...prev, body.category]);
  };

  const putCategory = async (updated: Category) => {
    const res = await fetch(`/api/admin/categories/${encodeURIComponent(updated.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const body = await readJsonOrThrow(res);
    setCategories(prev => prev.map(c => (c.id === updated.id ? body.category : c)));
  };

  const updateCategory = async (id: string, label: string) => {
    const current = categories.find(c => c.id === id);
    if (!current) return;
    await putCategory({ ...current, label });
  };

  const deleteCategory = async (id: string) => {
    const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
    await readJsonOrThrow(res);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const reorderCategories = async (orderedIds: string[]) => {
    const previous = categories;
    const reordered = orderedIds
      .map(id => previous.find(c => c.id === id))
      .filter((c): c is Category => Boolean(c));
    setCategories(reordered);
    try {
      const res = await fetch("/api/admin/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      await readJsonOrThrow(res);
    } catch (err) {
      setCategories(previous);
      throw err;
    }
  };

  const addSubcategory = async (categoryId: string, label: string) => {
    const current = categories.find(c => c.id === categoryId);
    if (!current) return;
    const taken = [...categories.map(c => c.id), ...current.subcategories.map(s => s.id)];
    const id = uniqueId(label, taken);
    await putCategory({ ...current, subcategories: [...current.subcategories, { id, label }] });
  };

  const updateSubcategory = async (categoryId: string, subcategoryId: string, label: string) => {
    const current = categories.find(c => c.id === categoryId);
    if (!current) return;
    await putCategory({
      ...current,
      subcategories: current.subcategories.map(s => (s.id === subcategoryId ? { ...s, label } : s)),
    });
  };

  const deleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    const current = categories.find(c => c.id === categoryId);
    if (!current) return;
    await putCategory({
      ...current,
      subcategories: current.subcategories.filter(s => s.id !== subcategoryId),
    });
  };

  const reorderSubcategories = async (categoryId: string, orderedSubIds: string[]) => {
    const current = categories.find(c => c.id === categoryId);
    if (!current) return;
    const reordered = orderedSubIds
      .map(id => current.subcategories.find(s => s.id === id))
      .filter((s): s is Subcategory => Boolean(s));
    await putCategory({ ...current, subcategories: reordered });
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        isLoaded,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory,
        reorderSubcategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories must be used within CategoriesProvider");
  }
  return context;
}
