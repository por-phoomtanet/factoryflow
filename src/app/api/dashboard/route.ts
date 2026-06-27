import { NextResponse } from "next/server";
import { fetchAllSheets } from "@/services/googleSheet";
import { buildDashboard } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

/**
 * GET /api/dashboard
 * ดึงข้อมูลทั้ง 7 แท็บ แล้วคำนวณเป็น view model ของ dashboard
 */
export async function GET() {
  try {
    const sheets = await fetchAllSheets();
    const dashboard = buildDashboard(sheets);
    return NextResponse.json(dashboard, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/dashboard] error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
