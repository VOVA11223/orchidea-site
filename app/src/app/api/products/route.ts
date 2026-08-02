import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase";
import { rowToProduct } from "@/lib/product-mapping";

export async function GET() {
  const { data, error } = await supabasePublic
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, products: data.map(rowToProduct) });
}
