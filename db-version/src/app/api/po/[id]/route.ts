import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Po } from "@/models/models";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET /api/po/:id — ดึง PO รายตัว
 */
export async function GET(_req: Request, { params }: Ctx) {
  try {
    await connectDB();
    const { id } = await params;
    const item = await Po.findById(id).lean();
    if (!item) return NextResponse.json({ error: "ไม่พบ PO" }, { status: 404 });
    return NextResponse.json(item, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/po/:id — แก้ไข PO
 */
export async function PUT(req: Request, { params }: Ctx) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const update = {
      ...(body.PO_NO !== undefined && { PO_NO: body.PO_NO }),
      ...(body.CUSTOMER !== undefined && { CUSTOMER: body.CUSTOMER }),
      ...(body.PRODUCT !== undefined && { PRODUCT: body.PRODUCT }),
      ...(body.QTY_BAG !== undefined && { QTY_BAG: String(body.QTY_BAG) }),
      ...(body.DUE_DATE !== undefined && { DUE_DATE: body.DUE_DATE }),
      ...(body.PRIORITY !== undefined && { PRIORITY: body.PRIORITY }),
      ...(body.STATUS !== undefined && { STATUS: body.STATUS }),
    };

    const updated = await Po.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) return NextResponse.json({ error: "ไม่พบ PO" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/po/:id — ลบ PO
 */
export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Po.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ error: "ไม่พบ PO" }, { status: 404 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
