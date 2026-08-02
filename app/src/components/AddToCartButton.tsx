"use client";
import { useCart } from "@/lib/cart-context";
import { useEffect, useState } from "react";

type Props = {
  id: string;
  name: string;
  article: string;
  price: number;
  image?: string;
  minQty?: number;
  qty?: number;
};

export default function AddToCartButton({ id, name, article, price, image, minQty = 1, qty }: Props) {
  const { items, add, update } = useCart();
  const cartItem = items.find(i => i.id === id);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (cartItem) setInputValue(String(cartItem.qty));
  }, [cartItem?.qty]);

  function commitQty(value: string) {
    const n = parseInt(value, 10);
    update(id, Number.isNaN(n) ? 0 : n);
  }

  if (!cartItem) {
    return (
      <button
        onClick={() => add({ id, name, article, price, image, minQty, qty: qty ?? minQty })}
        className="w-full min-h-[44px] py-2 rounded-xl text-sm font-medium transition-colors bg-primary-600 hover:bg-primary-500 text-white"
      >
        В корзину
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => update(id, cartItem.qty - minQty)}
        className="w-10 h-10 flex-shrink-0 rounded-lg bg-muted hover:bg-border transition-colors text-foreground"
        aria-label="Уменьшить количество"
      >
        −
      </button>
      <input
        type="number"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onBlur={e => commitQty(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
        className="w-full min-w-0 h-10 text-center text-sm font-medium bg-input text-foreground border border-border rounded-lg focus:outline-none focus:border-primary-400"
      />
      <button
        onClick={() => update(id, cartItem.qty + minQty)}
        className="w-10 h-10 flex-shrink-0 rounded-lg bg-muted hover:bg-border transition-colors text-foreground"
        aria-label="Увеличить количество"
      >
        +
      </button>
    </div>
  );
}
