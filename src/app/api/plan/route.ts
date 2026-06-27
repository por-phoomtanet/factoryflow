import { NextResponse } from "next/server";
import { fetchProductionPlans } from "@/services/googleSheet";

// บังคับให้รันแบบ dynamic เสมอ (ไม่ pre-render ตอน build)
export const dynamic = "force-dynamic";

/**
 * GET /api/plan
 * คืนค่า array ของ ProductionPlan ในรูปแบบ JSON
 */
export async function GET() {
  try {
    const plans = await fetchProductionPlans();
    return NextResponse.json(plans, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/plan] error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
