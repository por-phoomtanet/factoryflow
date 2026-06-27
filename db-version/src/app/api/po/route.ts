import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/seed";
import { Po } from "@/models/models";

export const dynamic = "force-dynamic";

/**
 * GET /api/po — รายการ PO ทั้งหมด (อ่านจาก MongoDB)
 */
export async function GET() {
  try {
    await connectDB();
    await ensureSeeded();
    const items = await Po.find().sort({ PO_NO: 1 }).lean();
    return NextResponse.json(items, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

/**
 * POST /api/po — สร้าง PO ใหม่
 */
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body?.PO_NO) {
      return NextResponse.json({ error: "ต้องระบุ PO_NO" }, { status: 400 });
    }

    const exists = await Po.findOne({ PO_NO: body.PO_NO }).lean();
    if (exists) {
      return NextResponse.json(
        { error: `PO_NO "${body.PO_NO}" มีอยู่แล้ว` },
        { status: 409 }
      );
    }

    const created = await Po.create({
      PO_NO: body.PO_NO,
      CUSTOMER: body.CUSTOMER ?? "",
      PRODUCT: body.PRODUCT ?? "",
      QTY_BAG: String(body.QTY_BAG ?? ""),
      DUE_DATE: body.DUE_DATE ?? "",
      PRIORITY: body.PRIORITY ?? "LOW",
      STATUS: body.STATUS ?? "WAITING",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
