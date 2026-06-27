import { NextResponse } from "next/server";
import { reseed } from "@/lib/seed";

export const dynamic = "force-dynamic";

/**
 * POST /api/seed → ล้างแล้ว seed ข้อมูลตัวอย่างใหม่ทั้งหมด
 */
export async function POST() {
  try {
    const counts = await reseed();
    return NextResponse.json({ ok: true, seeded: counts }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/seed] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
