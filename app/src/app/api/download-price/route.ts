import ExcelJS from "exceljs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { supabasePublic } from "@/lib/supabase";
import type { ProductRow } from "@/lib/product-mapping";
import type { Category } from "@/lib/categories-context";

type ImageExtension = "jpeg" | "png" | "gif";

function extensionFromUrl(url: string): ImageExtension | null {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "jpeg";
  if (clean.endsWith(".png")) return "png";
  if (clean.endsWith(".gif")) return "gif";
  return null;
}

async function loadImage(url: string | undefined): Promise<{ buffer: Buffer; extension: ImageExtension } | null> {
  if (!url) return null;
  const extension = extensionFromUrl(url);
  if (!extension) return null;

  try {
    if (url.startsWith("/")) {
      const buffer = await readFile(path.join(process.cwd(), "public", url));
      return { buffer, extension };
    }
    if (url.startsWith("http")) {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return null;
      const buffer = Buffer.from(await res.arrayBuffer());
      return { buffer, extension };
    }
  } catch {
    return null;
  }
  return null;
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

export async function GET() {
  const [{ data: products, error: productsError }, { data: categories, error: categoriesError }] = await Promise.all([
    supabasePublic.from("products").select("*").order("created_at", { ascending: true }),
    supabasePublic.from("categories").select("*"),
  ]);

  if (productsError) {
    return Response.json({ ok: false, error: productsError.message }, { status: 500 });
  }
  if (categoriesError) {
    return Response.json({ ok: false, error: categoriesError.message }, { status: 500 });
  }

  const categoryLabels = new Map<string, string>();
  (categories as Category[]).forEach(c => {
    categoryLabels.set(c.id, c.label);
    c.subcategories.forEach(sc => categoryLabels.set(sc.id, sc.label));
  });

  const rows = products as ProductRow[];
  const images = await mapWithConcurrency(rows, 8, p => loadImage(p.img));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Прайс-лист");

  const COLUMNS: { header: string; key: string; width: number; align: "left" | "center" }[] = [
    { header: "Фото", key: "photo", width: 11, align: "center" },
    { header: "Артикул", key: "article", width: 16, align: "left" },
    { header: "Категория", key: "category", width: 22, align: "left" },
    { header: "Наименование", key: "name", width: 40, align: "left" },
    { header: "Высота", key: "height", width: 12, align: "center" },
    { header: "Мин. упаковка", key: "minQty", width: 16, align: "center" },
    { header: "Количество бутонов", key: "budCount", width: 20, align: "center" },
    { header: "Наличие", key: "inStock", width: 14, align: "center" },
  ];

  sheet.columns = COLUMNS.map(({ header, key, width }) => ({ header, key, width }));

  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: "thin", color: { argb: "FFD9D9D9" } },
    left: { style: "thin", color: { argb: "FFD9D9D9" } },
    bottom: { style: "thin", color: { argb: "FFD9D9D9" } },
    right: { style: "thin", color: { argb: "FFD9D9D9" } },
  };

  const headerRow = sheet.getRow(1);
  headerRow.height = 30;
  COLUMNS.forEach((_col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.font = { bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F0E8" } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = thinBorder;
  });

  rows.forEach((p, i) => {
    const row = sheet.addRow({
      article: p.article,
      category: categoryLabels.get(p.category) ?? p.category,
      name: p.name,
      height: p.height,
      minQty: p.min_qty,
      budCount: p.bud_count ?? "",
      inStock: p.in_stock ? "В наличии" : "Нет в наличии",
    });
    row.height = 56;
    COLUMNS.forEach((col, ci) => {
      const cell = row.getCell(ci + 1);
      cell.alignment = { vertical: "middle", horizontal: col.align, wrapText: false };
      cell.border = thinBorder;
    });

    const image = images[i];
    if (image) {
      // exceljs pulls in a second, older @types/node (via @fast-csv) whose Buffer
      // shape conflicts with the top-level one — cast to sidestep the false mismatch.
      const imageId = workbook.addImage({ buffer: image.buffer as unknown as ExcelJS.Buffer, extension: image.extension });
      sheet.addImage(imageId, {
        tl: { col: 0.13, row: row.number - 1 + 0.1 },
        ext: { width: 60, height: 60 },
        editAs: "oneCell",
      });
    }
  });

  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const date = new Date().toISOString().slice(0, 10);

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="price-list-${date}.xlsx"`,
    },
  });
}
