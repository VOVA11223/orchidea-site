import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/admin-auth";
import { rowToProduct, productToRow } from "@/lib/product-mapping";
import type { Product } from "@/lib/products-context";

type Context = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Context) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await ctx.params;

  let product: Product;
  try {
    product = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("products")
    .update(productToRow(product))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, product: rowToProduct(data) });
}

export async function DELETE(req: NextRequest, ctx: Context) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const { error } = await supabaseAdmin().from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
