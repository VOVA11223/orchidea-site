import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/admin-auth";
import { rowToProduct, productToRow } from "@/lib/product-mapping";
import type { Product } from "@/lib/products-context";

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });
  }

  let product: Product;
  try {
    product = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  if (!product.id?.trim() || !product.name?.trim()) {
    return NextResponse.json({ ok: false, error: "Не заполнены обязательные поля" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("products")
    .insert(productToRow(product))
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { ok: false, error: `Товар с артикулом "${product.id}" уже существует` },
        { status: 409 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, product: rowToProduct(data) });
}
