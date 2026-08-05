"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Product {
  id: string;
  name: string;
  article: string;
  category: string;
  price: number;
  minQty: number;
  height: number | string;
  budCount: number | string;
  colors: string[];
  img: string;
  images: string[];
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  oldPrice: number | string;
}

interface ProductsContextType {
  products: Product[];
  isLoaded: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

async function readJsonOrThrow(res: Response) {
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.ok) {
    throw new Error(body?.error || `Запрос не выполнен (${res.status})`);
  }
  return body;
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load(attemptsLeft: number): Promise<void> {
      try {
        const res = await fetch("/api/products");
        const body = await res.json();
        if (!body.ok) throw new Error(body.error || "Запрос не выполнен");
        if (!cancelled) {
          setProducts(body.products);
          setIsLoaded(true);
        }
      } catch {
        if (cancelled) return;
        if (attemptsLeft > 0) {
          await new Promise(r => setTimeout(r, 800));
          if (!cancelled) await load(attemptsLeft - 1);
        } else {
          setProducts([]);
          setIsLoaded(true);
        }
      }
    }

    load(2);
    return () => { cancelled = true; };
  }, []);

  const addProduct = async (product: Product) => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const body = await readJsonOrThrow(res);
    setProducts(prev => [...prev, body.product]);
  };

  const updateProduct = async (id: string, product: Product) => {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const body = await readJsonOrThrow(res);
    setProducts(prev => prev.map(p => (p.id === id ? body.product : p)));
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" });
    await readJsonOrThrow(res);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  return (
    <ProductsContext.Provider value={{ products, isLoaded, addProduct, updateProduct, deleteProduct, getProductById }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider");
  }
  return context;
}
