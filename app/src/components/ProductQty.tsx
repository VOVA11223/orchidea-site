"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import AddToCartButton from "@/components/AddToCartButton";

type Props = {
  id: string;
  name: string;
  article: string;
  price: number;
  image?: string;
  minQty: number;
};

export default function ProductQty({ id, name, article, price, image, minQty }: Props) {
  const { items } = useCart();
  const inCart = items.some(i => i.id === id);
  const [qty, setQty] = useState(minQty);

  return (
    <div>
      {!inCart && (
        <div className="flex items-center justify-center gap-6 mb-4">
          <button
            onClick={() => setQty(q => Math.max(minQty, q - minQty))}
            className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-lg text-neutral-600 hover:bg-neutral-50 transition-colors"
            aria-label="Уменьшить количество"
          >
            −
          </button>
          <span className="text-lg font-semibold text-neutral-900 min-w-8 text-center">{qty}</span>
          <button
            onClick={() => setQty(q => q + minQty)}
            className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-lg text-neutral-600 hover:bg-neutral-50 transition-colors"
            aria-label="Увеличить количество"
          >
            +
          </button>
        </div>
      )}
      <AddToCartButton id={id} name={name} article={article} price={price} image={image} minQty={minQty} qty={qty} />
    </div>
  );
}
