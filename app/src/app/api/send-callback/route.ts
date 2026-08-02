import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "orchidea_opt@mail.ru";

export async function POST(req: NextRequest) {
  let body: { name?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name?.trim();
  const phone = body.phone?.trim();
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "Missing name or phone" }, { status: 400 });
  }

  const message = `Заявка на обратный звонок
Дата: ${new Date().toLocaleString("ru-RU")}

Имя: ${name}
Телефон: ${phone}`;

  try {
    const { sent } = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `Заявка на обратный звонок — ${name}`,
      text: message,
    });
    return NextResponse.json({ ok: true, sent });
  } catch (error) {
    console.error("[send-callback] failed:", error);
    return NextResponse.json({ ok: false, error: "Failed to send email" }, { status: 502 });
  }
}
