import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "orchidea_opt@mail.ru";
const DELIVERY_PRICE = 500;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type CheckoutPayload = {
  clientName: string;
  clientPhone: string;
  deliveryAddress: string;
  deliveryDateTime?: string;
  notes?: string;
  items: { id: string; name: string; article: string; price: number; qty: number }[];
};

export async function POST(req: NextRequest) {
  let payload: CheckoutPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { clientName, clientPhone, deliveryAddress, deliveryDateTime, notes, items } = payload;

  if (!clientName?.trim() || !clientPhone?.trim() || !deliveryAddress?.trim() || !items?.length) {
    return NextResponse.json({ ok: false, error: "Missing required checkout fields" }, { status: 400 });
  }

  const orderItems = items.map(i => ({ id: i.id, name: i.name, article: i.article, price: i.price, quantity: i.qty }));
  const totalPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = {
    id: "ORD-" + Date.now(),
    createdAt: new Date().toISOString(),
    clientName: clientName.trim(),
    clientPhone: clientPhone.trim(),
    clientEmail: "",
    clientCompany: "",
    items: orderItems,
    totalPrice,
    deliveryAddress: deliveryAddress.trim(),
    deliveryDateTime,
    deliveryType: "courier" as const,
    deliveryPrice: DELIVERY_PRICE,
    paymentStatus: "pending" as const,
    orderStatus: "new" as const,
    notes,
  };

  const grandTotal = order.totalPrice + order.deliveryPrice;
  const createdAtText = new Date(order.createdAt).toLocaleString("ru-RU");

  const itemsText = orderItems
    .map(i => `  - [${i.article}] ${i.name} x${i.quantity} — ${(i.price * i.quantity).toLocaleString("ru")} ₽`)
    .join("\n");

  const emailText = `Новый заказ ${order.id}
Дата: ${createdAtText}

Получатель: ${order.clientName}
Телефон: ${order.clientPhone}
Адрес доставки: ${order.deliveryAddress}
${order.deliveryDateTime ? `Желаемое время доставки: ${order.deliveryDateTime}\n` : ""}${order.notes ? `Комментарий: ${order.notes}\n` : ""}
Товары:
${itemsText}

Сумма товаров: ${order.totalPrice.toLocaleString("ru")} ₽
Доставка: ${order.deliveryPrice.toLocaleString("ru")} ₽
Итого: ${grandTotal.toLocaleString("ru")} ₽`;

  const itemsHtml = orderItems
    .map(
      i => `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #eee;color:#7A8B80;font-family:monospace;white-space:nowrap;">${escapeHtml(i.article)}</td>
        <td style="padding:6px 0;border-bottom:1px solid #eee;">${escapeHtml(i.name)}</td>
        <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
        <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">${(i.price * i.quantity).toLocaleString("ru")} ₽</td>
      </tr>`
    )
    .join("");

  const emailHtml = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1A2420;">
    <h2 style="color:#2F7231;margin-bottom:4px;">Новый заказ ${order.id}</h2>
    <p style="color:#7A8B80;font-size:13px;margin-top:0;">${createdAtText}</p>

    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:4px 0;color:#7A8B80;width:180px;">Имя</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(order.clientName)}</td></tr>
      <tr><td style="padding:4px 0;color:#7A8B80;">Телефон</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(order.clientPhone)}</td></tr>
      <tr><td style="padding:4px 0;color:#7A8B80;">Адрес доставки</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(order.deliveryAddress)}</td></tr>
      ${order.deliveryDateTime ? `<tr><td style="padding:4px 0;color:#7A8B80;">Желаемое время</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(order.deliveryDateTime)}</td></tr>` : ""}
      ${order.notes ? `<tr><td style="padding:4px 0;color:#7A8B80;">Комментарий</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(order.notes)}</td></tr>` : ""}
    </table>

    <h3 style="color:#193B1A;margin-bottom:6px;">Товары</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="border-bottom:2px solid #DDE5DF;color:#7A8B80;text-align:left;">
          <th style="padding:6px 0;font-weight:500;">Артикул</th>
          <th style="padding:6px 0;font-weight:500;">Товар</th>
          <th style="padding:6px 0;font-weight:500;text-align:center;">Кол-во</th>
          <th style="padding:6px 0;font-weight:500;text-align:right;">Сумма</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;">
      <tr><td style="padding:2px 0;color:#7A8B80;">Сумма товаров</td><td style="padding:2px 0;text-align:right;">${order.totalPrice.toLocaleString("ru")} ₽</td></tr>
      <tr><td style="padding:2px 0;color:#7A8B80;">Доставка</td><td style="padding:2px 0;text-align:right;">${order.deliveryPrice.toLocaleString("ru")} ₽</td></tr>
      <tr><td style="padding:8px 0 0;font-weight:700;font-size:16px;">Итого</td><td style="padding:8px 0 0;text-align:right;font-weight:700;font-size:16px;color:#2F7231;">${grandTotal.toLocaleString("ru")} ₽</td></tr>
    </table>
  </div>`;

  let emailSent = false;
  try {
    ({ sent: emailSent } = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `Новый заказ ${order.id}`,
      text: emailText,
      html: emailHtml,
    }));
  } catch (error) {
    // The order itself is still valid even if the notification email fails.
    console.error("[checkout] failed to send order email:", error);
  }

  return NextResponse.json({ ok: true, order, emailSent });
}
