import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/seed";
import { buildDashboard, type AllSheets } from "@/lib/dashboard";
import { Po, Plan, Result, Material, Bom, Packaging, Line } from "@/models/models";

export const dynamic = "force-dynamic";

/**
 * GET /api/dashboard — ดึงทุก collection จาก MongoDB แล้วคำนวณ view model
 */
export async function GET() {
  try {
    await connectDB();
    await ensureSeeded();

    const [poList, plans, results, materials, boms, packaging, lines] =
      await Promise.all([
        Po.find().lean(),
        Plan.find().lean(),
        Result.find().lean(),
        Material.find().lean(),
        Bom.find().lean(),
        Packaging.find().lean(),
        Line.find().lean(),
      ]);

    const sheets = {
      poList,
      plans,
      results,
      materials,
      boms,
      packaging,
      lines,
    } as unknown as AllSheets;

    return NextResponse.json(buildDashboard(sheets), { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/dashboard] error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
