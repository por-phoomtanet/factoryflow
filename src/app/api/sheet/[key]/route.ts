import { NextResponse } from "next/server";
import { fetchCollection } from "@/services/googleSheet";

export const dynamic = "force-dynamic";

/**
 * GET /api/sheet/:key — อ่านแท็บใดก็ได้จาก Google Sheet (อ่านอย่างเดียว)
 * key = po | plan | result | material | bom | packaging | line
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const rows = await fetchCollection(key);
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
