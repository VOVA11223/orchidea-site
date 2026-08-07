import type { Product } from "@/lib/products-context";

export interface ProductRow {
  id: string;
  name: string;
  article: string;
  code: string | null;
  category: string;
  price: number;
  min_qty: number;
  height: string;
  bud_count: number | null;
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
    code: row.code ?? "",
    category: row.category,
    price: row.price,
    minQty: row.min_qty,
    height: row.height,
    budCount: row.bud_count ?? "",
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
    code: product.code?.trim() ? product.code.trim() : null,
    category: product.category,
    price: Number(product.price) || 0,
    min_qty: Number(product.minQty) || 0,
    height: String(product.height ?? ""),
    bud_count: product.budCount === "" || product.budCount === undefined ? null : Number(product.budCount),
    colors: product.colors,
    img: images[0] ?? product.img,
    images,
    in_stock: product.inStock,
    is_new: product.isNew,
    is_sale: product.isSale,
    old_price: String(product.oldPrice ?? ""),
  };
}
