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
  colors: string[];
  img: string;
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  oldPrice: number | string;
}

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const DEFAULT_PRODUCTS: Product[] = [
  { id: "or-3291", name: "Орхидея Фаленопсис лиловая 80 см", article: "or-3291", category: "orchids", price: 110, minQty: 5, height: 80, colors: ["#b794f4"], img: "/images/orchids.jpg", inStock: true, isNew: true, isSale: false, oldPrice: "" },
  { id: "or-3278", name: "Роза бордюрная кремовая 40 см", article: "or-3278", category: "roses", price: 29, minQty: 50, height: 40, colors: ["#faf089"], img: "/images/roses.jpg", inStock: true, isNew: false, isSale: false, oldPrice: "" },
  { id: "or-3275", name: "Хризантема одноголовая молочная 70 см", article: "or-3275", category: "chrysanthemums", price: 52, minQty: 10, height: 70, colors: ["#fdf6e3"], img: "/images/chrysanthemums.jpg", inStock: true, isNew: false, isSale: false, oldPrice: "" },
  { id: "or-3271", name: "Пион садовый пыльно-розовый 60 см", article: "or-3271", category: "peonies", price: 87, minQty: 10, height: 60, colors: ["#d69fb0"], img: "/images/peonies.jpg", inStock: true, isNew: false, isSale: true, oldPrice: "99" },
  { id: "or-3301", name: "Тюльпан махровый жёлтый 45 см", article: "or-3301", category: "tulips", price: 38, minQty: 25, height: 45, colors: ["#f6e05e"], img: "/images/tulips.jpg", inStock: true, isNew: false, isSale: false, oldPrice: "" },
  { id: "or-3302", name: "Ветка эвкалипта серебристая 70 см", article: "or-3302", category: "branches", price: 42, minQty: 5, height: 70, colors: ["#a0aec0"], img: "/images/branches.webp", inStock: true, isNew: true, isSale: false, oldPrice: "" },
  { id: "or-3303", name: "Роза эквадорская красная 60 см", article: "or-3303", category: "roses", price: 76, minQty: 25, height: 60, colors: ["#e53e3e"], img: "/images/roses.jpg", inStock: true, isNew: false, isSale: true, oldPrice: "89" },
  { id: "or-3304", name: "Орхидея Ванда белая 85 см", article: "or-3304", category: "orchids", price: 110, minQty: 5, height: 85, colors: ["#f7fafc"], img: "/images/orchids.jpg", inStock: true, isNew: false, isSale: false, oldPrice: "" },
  { id: "or-3305", name: "Хризантема сантини зелёная 55 см", article: "or-3305", category: "chrysanthemums", price: 33, minQty: 10, height: 55, colors: ["#48bb78"], img: "/images/chrysanthemums.jpg", inStock: true, isNew: false, isSale: false, oldPrice: "" },
  { id: "or-3306", name: "Пион коралловый 65 см", article: "or-3306", category: "peonies", price: 112, minQty: 10, height: 65, colors: ["#fc8181"], img: "/images/peonies.jpg", inStock: false, isNew: false, isSale: false, oldPrice: "" },
  { id: "or-3307", name: "Тюльпан простой оранжевый 45 см", article: "or-3307", category: "tulips", price: 25, minQty: 25, height: 45, colors: ["#f97316"], img: "/images/tulips.jpg", inStock: true, isNew: false, isSale: true, oldPrice: "30" },
  { id: "or-3308", name: "Ветка сакуры декоративная 90 см", article: "or-3308", category: "branches", price: 64, minQty: 5, height: 90, colors: ["#ed64a6"], img: "/images/branches.webp", inStock: true, isNew: true, isSale: false, oldPrice: "" },
  { id: "or-3309", name: "Роза бордюрная белая 40 см", article: "or-3309", category: "roses", price: 31, minQty: 50, height: 40, colors: ["#f7fafc"], img: "/images/roses.jpg", inStock: true, isNew: false, isSale: false, oldPrice: "" },
];

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("orchidea_products");
    if (stored) {
      try {
        const parsed: (Product & { color?: string })[] = JSON.parse(stored);
        const seenIds = new Set<string>();
        const migrated = parsed
          .map(p => p.colors ? p : { ...p, colors: p.color ? [p.color] : [] })
          .map(p => p.article ? p : { ...p, article: p.id })
          .map(p => {
            if (!seenIds.has(p.id)) {
              seenIds.add(p.id);
              return p;
            }
            let n = 2;
            while (seenIds.has(`${p.id}-${n}`)) n++;
            const uniqueId = `${p.id}-${n}`;
            seenIds.add(uniqueId);
            return { ...p, id: uniqueId, article: uniqueId };
          });
        const missing = DEFAULT_PRODUCTS.filter(dp => !migrated.some(p => p.id === dp.id));
        setProducts([...migrated, ...missing]);
      } catch {
        setProducts(DEFAULT_PRODUCTS);
      }
    } else {
      setProducts(DEFAULT_PRODUCTS);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("orchidea_products", JSON.stringify(products));
    }
  }, [products, isLoaded]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (id: string, product: Product) => {
    setProducts(prev => prev.map(p => p.id === id ? product : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductById }}>
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
