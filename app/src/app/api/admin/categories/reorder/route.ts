import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });
  }

  let orderedIds: string[];
  try {
    ({ orderedIds } = await req.json());
    if (!Array.isArray(orderedIds) || orderedIds.some(id => typeof id !== "string")) {
      throw new Error();
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const admin = supabaseAdmin();
  const results = await Promise.all(
    orderedIds.map((id, index) => admin.from("categories").update({ sort_order: index }).eq("id", id))
  );
  const failed = results.find(r => r.error);
  if (failed?.error) {
    return NextResponse.json({ ok: false, error: failed.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
