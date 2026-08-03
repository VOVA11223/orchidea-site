import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/admin-auth";
import type { Category } from "@/lib/categories-context";

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });
  }

  let category: Category;
  try {
    category = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  if (!category.id?.trim() || !category.label?.trim()) {
    return NextResponse.json({ ok: false, error: "Не заполнены обязательные поля" }, { status: 400 });
  }

  const admin = supabaseAdmin();
  const { data: last } = await admin
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = (last?.sort_order ?? -1) + 1;

  const { data, error } = await admin
    .from("categories")
    .insert({ ...category, sort_order: sortOrder })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: false, error: `Категория "${category.id}" уже существует` }, { status: 409 });
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, category: data });
}
