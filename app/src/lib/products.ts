export type Product = {
  id: string;
  name: string;
  article: string;
  category: string;
  price: number;
  minQty: number;
  height: number;
  color: string;
  img: string;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  oldPrice?: number;
};

export const PRODUCTS: Product[] = [
  { id: "or-2847", name: "Роза кустовая бархатная 65 см красная", article: "OR-2847", category: "roses", price: 44, minQty: 25, height: 65, color: "red", img: "/images/roses.jpg", inStock: true },
  { id: "or-3278", name: "Роза бордюрная кремовая 40 см", article: "OR-3278", category: "roses", price: 29, minQty: 50, height: 40, color: "cream", img: "/images/roses.jpg", inStock: true, isNew: true },
  { id: "or-2289", name: "Роза эквадорская красная 60 см Freedom", article: "OR-2289", category: "roses", price: 76, minQty: 25, height: 60, color: "red", img: "/images/roses.jpg", inStock: true, isSale: true, oldPrice: 89 },
  { id: "or-3187", name: "Роза эквадорская белая 70 см Avalanche", article: "OR-3187", category: "roses", price: 95, minQty: 25, height: 70, color: "white", img: "/images/roses.jpg", inStock: true },

  { id: "or-2651", name: "Хризантема кустовая белый микс 65 см", article: "OR-2651", category: "chrysanthemums", price: 40, minQty: 10, height: 65, color: "white", img: "/images/chrysanthemums.jpg", inStock: true },
  { id: "or-3275", name: "Хризантема одноголовая молочная 70 см", article: "OR-3275", category: "chrysanthemums", price: 52, minQty: 10, height: 70, color: "cream", img: "/images/chrysanthemums.jpg", inStock: true, isNew: true },
  { id: "or-3162", name: "Хризантема сантини зелёная Кимберли 55 см", article: "OR-3162", category: "chrysanthemums", price: 33, minQty: 10, height: 55, color: "green", img: "/images/chrysanthemums.jpg", inStock: true },
  { id: "or-2176", name: "Хризантема одноголовая кремовая 70 см", article: "OR-2176", category: "chrysanthemums", price: 45, minQty: 10, height: 70, color: "cream", img: "/images/chrysanthemums.jpg", inStock: false, isSale: true, oldPrice: 50 },

  { id: "or-3271", name: "Пион садовый пыльно-розовый 60 см", article: "OR-3271", category: "peonies", price: 87, minQty: 10, height: 60, color: "pink", img: "/images/peonies.jpg", inStock: true, isNew: true },
  { id: "or-2418", name: "Пион садовый белый Dinner Plate 60 см", article: "OR-2418", category: "peonies", price: 89, minQty: 10, height: 60, color: "white", img: "/images/peonies.jpg", inStock: true, isSale: true, oldPrice: 99 },
  { id: "or-3175", name: "Пион коралловый Coral Charm 65 см", article: "OR-3175", category: "peonies", price: 112, minQty: 10, height: 65, color: "coral", img: "/images/peonies.jpg", inStock: true },

  { id: "or-2743", name: "Тюльпан махровый фиолетовый 45 см", article: "OR-2743", category: "tulips", price: 40, minQty: 25, height: 45, color: "violet", img: "/images/tulips.jpg", inStock: true, isSale: true, oldPrice: 45 },
  { id: "or-3280", name: "Тюльпан попугайный жёлтый 45 см", article: "OR-3280", category: "tulips", price: 38, minQty: 25, height: 45, color: "yellow", img: "/images/tulips.jpg", inStock: true, isNew: true },
  { id: "or-2084", name: "Тюльпан простой оранжевый 45 см", article: "OR-2084", category: "tulips", price: 25, minQty: 25, height: 45, color: "orange", img: "/images/tulips.jpg", inStock: true, isSale: true, oldPrice: 30 },
  { id: "or-3198", name: "Тюльпан французский лиловый 50 см", article: "OR-3198", category: "tulips", price: 41, minQty: 25, height: 50, color: "lilac", img: "/images/tulips.jpg", inStock: true },

  { id: "or-3291", name: "Орхидея Фаленопсис лиловая 80 см", article: "OR-3291", category: "orchids", price: 110, minQty: 5, height: 80, color: "lilac", img: "/images/orchids.jpg", inStock: true, isNew: true },
  { id: "or-3268", name: "Орхидея Ванда белая крупная 85 см", article: "OR-3268", category: "orchids", price: 110, minQty: 5, height: 85, color: "white", img: "/images/orchids.jpg", inStock: true },
  { id: "or-2301", name: "Орхидея Цимбидиум жёлтая 75 см", article: "OR-2301", category: "orchids", price: 85, minQty: 5, height: 75, color: "yellow", img: "/images/orchids.jpg", inStock: false, isSale: true, oldPrice: 100 },

  { id: "or-3294", name: "Ветка сакуры декоративная 90 см", article: "OR-3294", category: "branches", price: 64, minQty: 5, height: 90, color: "pink", img: "/images/branches.webp", inStock: true, isNew: true },
  { id: "or-2539", name: "Ветка магнолии декоративная 85 см", article: "OR-2539", category: "branches", price: 55, minQty: 5, height: 85, color: "white", img: "/images/branches.webp", inStock: true, isSale: true, oldPrice: 65 },
  { id: "or-1997", name: "Ветка эвкалипта серебристая 70 см", article: "OR-1997", category: "branches", price: 42, minQty: 5, height: 70, color: "silver", img: "/images/branches.webp", inStock: true, isSale: true, oldPrice: 49 },
  { id: "or-3210", name: "Ветка вишни декоративная 75 см", article: "OR-3210", category: "branches", price: 64, minQty: 5, height: 75, color: "pink", img: "/images/branches.webp", inStock: true },
];

export const CATEGORIES = [
  { id: "branches", label: "Ветки и зелень", img: "/images/branches.webp" },
  { id: "orchids", label: "Орхидеи", img: "/images/orchids.jpg" },
  { id: "peonies", label: "Пионы", img: "/images/peonies.jpg" },
  { id: "roses", label: "Розы", img: "/images/roses.jpg" },
  { id: "tulips", label: "Тюльпаны", img: "/images/tulips.jpg" },
  { id: "chrysanthemums", label: "Хризантемы", img: "/images/chrysanthemums.jpg" },
];

// Категории с подкатегориями (новая структура каталога) — пока добавлена только
// первая категория, остальные (Ветки, Муляжи и т.д.) добавим следующими
export type CategoryNode = {
  id: string;
  label: string;
  subcategories?: { id: string; label: string }[];
};

export const CATEGORY_TREE: CategoryNode[] = [
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
];
