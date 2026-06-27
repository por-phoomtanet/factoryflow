import Papa from "papaparse";

/**
 * โครงสร้างข้อมูล PO หนึ่งรายการ (แท็บ PO_LIST)
 */
export interface PurchaseOrder {
  PO_NO: string;
  CUSTOMER: string;
  PRODUCT: string;
  QTY_BAG: string;
  DUE_DATE: string;
  PRIORITY: string;
  STATUS: string;
}

/**
 * โครงสร้างข้อมูลแผนผลิตหนึ่งรายการ (แท็บ PRODUCTION_PLAN)
 */
export interface ProductionPlan {
  PLAN_DATE: string;
  LINE: string;
  PO_NO: string;
  PRODUCT: string;
  START: string;
  END: string;
  TARGET: string;
}

/** PRODUCTION_RESULT */
export interface ProductionResult {
  DATE: string;
  LINE: string;
  PO_NO: string;
  PRODUCT: string;
  TARGET: string;
  ACTUAL: string;
  REJECT: string;
  STATUS: string;
}

/** RAW_MATERIAL */
export interface RawMaterial {
  CODE: string;
  MATERIAL: string;
  UNIT: string;
  STOCK: string;
  SAFETY_STOCK: string;
}

/** PRODUCT_BOM */
export interface ProductBom {
  PRODUCT: string;
  MATERIAL: string;
  QTY_PER_1000_BAG: string;
  UNIT: string;
}

/** PACKAGING_STOCK */
export interface PackagingStock {
  PACKAGE: string;
  SIZE: string;
  STOCK: string;
  MINIMUM: string;
}

/** PRODUCTION_LINE */
export interface ProductionLine {
  LINE: string;
  CAPACITY: string;
  CHANGEOVER: string;
}

/** ข้อมูลดิบทั้ง 7 แท็บ (สำหรับ dashboard) */
export interface AllSheets {
  poList: PurchaseOrder[];
  plans: ProductionPlan[];
  results: ProductionResult[];
  materials: RawMaterial[];
  boms: ProductBom[];
  packaging: PackagingStock[];
  lines: ProductionLine[];
}

// ===== ค่า config จาก environment =====
const API_KEY = process.env.GOOGLE_API_KEY;
const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const PO_RANGE = process.env.GOOGLE_PO_RANGE ?? "PO_LIST!A:G";
const PLAN_RANGE = process.env.GOOGLE_PLAN_RANGE ?? "PRODUCTION_PLAN!A:Z";
const RESULT_RANGE = process.env.GOOGLE_RESULT_RANGE ?? "PRODUCTION_RESULT!A:Z";
const MATERIAL_RANGE = process.env.GOOGLE_MATERIAL_RANGE ?? "RAW_MATERIAL!A:Z";
const BOM_RANGE = process.env.GOOGLE_BOM_RANGE ?? "PRODUCT_BOM!A:Z";
const PACKAGING_RANGE = process.env.GOOGLE_PACKAGING_RANGE ?? "PACKAGING_STOCK!A:Z";
const LINE_RANGE = process.env.GOOGLE_LINE_RANGE ?? "PRODUCTION_LINE!A:Z";

// ลิงก์ Published CSV (ใช้เป็น fallback เมื่อไม่ได้ตั้งค่า API key/ID)
const CSV_URL =
  process.env.GOOGLE_SHEET_CSV_URL ??
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDE4OZqH9FBqRYYHl6Cg141wx4RY_69IGcv3-2S7bkmTggKT-TVsn8CSj7CRCqljP3AeEKpb1ZnmtV/pub?gid=1379843816&single=true&output=csv";

/**
 * ดึงข้อมูล PO จากแท็บ PO_LIST
 *
 * - ถ้าตั้งค่า GOOGLE_API_KEY + GOOGLE_SHEETS_ID → ใช้ Sheets API v4 (เรียลไทม์ เป๊ะ)
 * - ถ้าไม่ครบ → fallback ไปอ่าน Published CSV
 */
export async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  const useApi = Boolean(API_KEY && SHEET_ID);
  const data = useApi
    ? await fetchSheetRange<PurchaseOrder>(PO_RANGE)
    : ((await fetchViaCsv()) as PurchaseOrder[]);

  console.log(
    `[googleSheet] อ่าน PO_LIST สำเร็จ (${useApi ? "Sheets API" : "CSV"}) ` +
      `จำนวน ${data.length} รายการ`
  );
  return data;
}

/**
 * ดึงข้อมูลแผนผลิตจากแท็บ PRODUCTION_PLAN ผ่าน Sheets API v4
 */
export async function fetchProductionPlans(): Promise<ProductionPlan[]> {
  const data = await fetchSheetRange<ProductionPlan>(PLAN_RANGE);
  console.log(`[googleSheet] อ่าน PRODUCTION_PLAN สำเร็จ จำนวน ${data.length} รายการ`);
  return data;
}

/**
 * อ่านช่วงเซลล์ใดก็ได้ผ่าน Google Sheets API v4 แล้วแปลงเป็น array ของ object
 * (ใช้แถวแรกเป็น header) — ใช้ซ้ำได้กับทุกแท็บ
 *
 * GET https://sheets.googleapis.com/v4/spreadsheets/{id}/values/{range}?key=...
 *
 * @throws {Error} เมื่อ fetch ไม่สำเร็จ (key ผิด / ไม่ได้แชร์ชีต / range ผิด)
 */
export async function fetchSheetRange<T>(range: string): Promise<T[]> {
  if (!API_KEY || !SHEET_ID) {
    throw new Error("ยังไม่ได้ตั้งค่า GOOGLE_API_KEY หรือ GOOGLE_SHEETS_ID ใน .env");
  }

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}` +
    `/values/${encodeURIComponent(range)}?key=${API_KEY}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (err) {
    throw new Error(
      `เชื่อมต่อ Sheets API ไม่ได้: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  if (!res.ok) {
    // ดึงข้อความ error จาก Google มาแสดงให้ชัด (เช่น key ผิด / ไม่ได้แชร์ชีต)
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error?.message) detail = body.error.message;
    } catch {
      /* ignore */
    }
    throw new Error(`Sheets API ตอบ error: ${detail}`);
  }

  const json = (await res.json()) as { values?: string[][] };
  return rowsToObjects<T>(json.values ?? []);
}

/**
 * แปลง 2D array (แถวแรก = header) เป็น array ของ object
 */
function rowsToObjects<T>(rows: string[][]): T[] {
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((row) => {
    const obj = {} as Record<string, string>;
    headers.forEach((key, i) => {
      obj[key] = row[i] ?? "";
    });
    return obj as unknown as T;
  });
}

/**
 * ดึงข้อมูลทั้ง 7 แท็บในครั้งเดียวด้วย batchGet (ประหยัด quota + เร็วกว่ายิงทีละแท็บ)
 * GET https://sheets.googleapis.com/v4/spreadsheets/{id}/values:batchGet?ranges=...&ranges=...
 *
 * @throws {Error} เมื่อ fetch ไม่สำเร็จ
 */
export async function fetchAllSheets(): Promise<AllSheets> {
  if (!API_KEY || !SHEET_ID) {
    throw new Error("ยังไม่ได้ตั้งค่า GOOGLE_API_KEY หรือ GOOGLE_SHEETS_ID ใน .env");
  }

  // ลำดับนี้ต้องตรงกับการ map ผลลัพธ์ด้านล่าง
  const ranges = [
    PO_RANGE,
    PLAN_RANGE,
    RESULT_RANGE,
    MATERIAL_RANGE,
    BOM_RANGE,
    PACKAGING_RANGE,
    LINE_RANGE,
  ];

  const qs = ranges.map((r) => `ranges=${encodeURIComponent(r)}`).join("&");
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchGet` +
    `?${qs}&key=${API_KEY}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (err) {
    throw new Error(
      `เชื่อมต่อ Sheets API ไม่ได้: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error?.message) detail = body.error.message;
    } catch {
      /* ignore */
    }
    throw new Error(`Sheets API ตอบ error: ${detail}`);
  }

  const json = (await res.json()) as {
    valueRanges?: { values?: string[][] }[];
  };
  const vr = json.valueRanges ?? [];
  const at = (i: number) => vr[i]?.values ?? [];

  const all: AllSheets = {
    poList: rowsToObjects<PurchaseOrder>(at(0)),
    plans: rowsToObjects<ProductionPlan>(at(1)),
    results: rowsToObjects<ProductionResult>(at(2)),
    materials: rowsToObjects<RawMaterial>(at(3)),
    boms: rowsToObjects<ProductBom>(at(4)),
    packaging: rowsToObjects<PackagingStock>(at(5)),
    lines: rowsToObjects<ProductionLine>(at(6)),
  };

  console.log(
    `[googleSheet] fetchAllSheets: PO=${all.poList.length} PLAN=${all.plans.length} ` +
      `RESULT=${all.results.length} MAT=${all.materials.length} BOM=${all.boms.length} ` +
      `PKG=${all.packaging.length} LINE=${all.lines.length}`
  );

  return all;
}

/**
 * อ่าน PO_LIST ผ่าน Published CSV (fallback) + papaparse
 */
async function fetchViaCsv(): Promise<PurchaseOrder[]> {
  let res: Response;
  try {
    // เติม timestamp เพื่อบายพาส cache ฝั่ง Google
    const sep = CSV_URL.includes("?") ? "&" : "?";
    res = await fetch(`${CSV_URL}${sep}_=${Date.now()}`, { cache: "no-store" });
  } catch (err) {
    throw new Error(
      `ไม่สามารถเชื่อมต่อ Google Sheet ได้: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  if (!res.ok) {
    throw new Error(`Fetch CSV ไม่สำเร็จ (HTTP ${res.status} ${res.statusText})`);
  }

  const csvText = await res.text();
  const parsed = Papa.parse<PurchaseOrder>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length > 0) {
    throw new Error(`แปลง CSV เป็น JSON ไม่สำเร็จ: ${parsed.errors[0].message}`);
  }

  return parsed.data;
}
