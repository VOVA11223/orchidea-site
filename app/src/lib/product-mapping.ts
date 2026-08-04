import type { Product } from "@/lib/products-context";

export interface ProductRow {
  id: string;
  name: string;
  article: string;
  category: string;
  price: number;
  min_qty: number;
  height: string;
  colors: string[];
  img: string;
  images: string[] | null;
  in_stock: boolean;
  is_new: boolean;
  is_sale: boolean;
  old_price: string;
}

export function rowToProduct(row: ProductRow): Product {
  const images = row.images && row.images.length > 0 ? row.images : (row.img ? [row.img] : []);
  return {
    id: row.id,
    name: row.name,
    article: row.article,
    category: row.category,
    price: row.price,
    minQty: row.min_qty,
    height: row.height,
    colors: row.colors,
    img: images[0] ?? row.img,
    images,
    inStock: row.in_stock,
    isNew: row.is_new,
    isSale: row.is_sale,
    oldPrice: row.old_price,
  };
}

export function productToRow(product: Product): ProductRow {
  const images = product.images && product.images.length > 0 ? product.images : (product.img ? [product.img] : []);
  return {
    id: product.id,
    name: product.name,
    article: product.article,
    category: product.category,
    price: Number(product.price) || 0,
    min_qty: Number(product.minQty) || 0,
    height: String(product.height ?? ""),
    colors: product.colors,
    img: images[0] ?? product.img,
    images,
    in_stock: product.inStock,
    is_new: product.isNew,
    is_sale: product.isSale,
    old_price: String(product.oldPrice ?? ""),
  };
}
