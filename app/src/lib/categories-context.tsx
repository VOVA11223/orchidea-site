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
  addCategory: (label: string) => void;
  updateCategory: (id: string, label: string) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (categoryId: string, label: string) => void;
  updateSubcategory: (categoryId: string, subcategoryId: string, label: string) => void;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "buketi",
    label: "Букеты",
    subcategories: [
      { id: "astry", label: "Астры" },
      { id: "gvozdiki", label: "Гвоздики" },
      { id: "delfinium", label: "Дельфиниум" },
      { id: "romashki", label: "Ромашки" },
    ],
  },
  { id: "branches", label: "Ветки и зелень", subcategories: [] },
  { id: "orchids", label: "Орхидеи", subcategories: [] },
  { id: "peonies", label: "Пионы", subcategories: [] },
  { id: "roses", label: "Розы", subcategories: [] },
  { id: "tulips", label: "Тюльпаны", subcategories: [] },
  { id: "chrysanthemums", label: "Хризантемы", subcategories: [] },
];

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

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("orchidea_categories");
    if (stored) {
      try {
        setCategories(JSON.parse(stored));
      } catch {
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("orchidea_categories", JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  const addCategory = (label: string) => {
    setCategories(prev => {
      const id = uniqueId(label, prev.map(c => c.id));
      return [...prev, { id, label, subcategories: [] }];
    });
  };

  const updateCategory = (id: string, label: string) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, label } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addSubcategory = (categoryId: string, label: string) => {
    setCategories(prev =>
      prev.map(c => {
        if (c.id !== categoryId) return c;
        const taken = [...prev.map(p => p.id), ...c.subcategories.map(s => s.id)];
        const id = uniqueId(label, taken);
        return { ...c, subcategories: [...c.subcategories, { id, label }] };
      })
    );
  };

  const updateSubcategory = (categoryId: string, subcategoryId: string, label: string) => {
    setCategories(prev =>
      prev.map(c =>
        c.id !== categoryId
          ? c
          : { ...c, subcategories: c.subcategories.map(s => (s.id === subcategoryId ? { ...s, label } : s)) }
      )
    );
  };

  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    setCategories(prev =>
      prev.map(c =>
        c.id !== categoryId ? c : { ...c, subcategories: c.subcategories.filter(s => s.id !== subcategoryId) }
      )
    );
  };

  return (
    <CategoriesContext.Provider
      value={{ categories, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory }}
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
